import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import millify from "millify";
import { Link } from "react-router-dom";
import { ILimitOrder, IPoolOverview } from "../../interface";
import { fetchPoolInfo, removeLimitOrder } from "../../libs/fetches";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { copyToClipboard } from "../../libs/utils";

interface AllOrderTableProps {
  data: ILimitOrder[] | null | undefined;
  refetch: Function;
  // isFetching: boolean;
}

export default function AllOrdersTable(props: AllOrderTableProps) {
  const handleCopyTokenAddress = (address: string) => {
    copyToClipboard(address, () => {
      toast.success("Successfuly copied");
    });
  };

  const getStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Active";
      case 2:
        return "Success";
      default:
        return "Failed";
    }
  };

  const getStatusContent = (item: ILimitOrder) => {
    if (item.status === 2) {
      //success
      if (item.sellOrders) {
        let detail = ``;
        for (let sell_order of item.sellOrders) {
          if (sell_order.type === 0) {
            if (detail) {
              detail += " / ";
            }
            detail = `${detail}TP: ${getStatus(sell_order.status as number)}`;
          } else {
            if (detail) {
              detail += " / ";
            }
            detail = `${detail}SL: ${getStatus(sell_order.status as number)}`;
          }
        }
        return detail;
      } else {
        return getStatus(item.status as number);
      }
    } else {
      return getStatus(item.status as number);
    }
  };

  const getCondition = (item: ILimitOrder) => {
    if (!item.type) {
      //buy
      if (item.sellOrders) {
        let detail = ``;
        for (let sell_order of item.sellOrders) {
          if (sell_order.type === 0) {
            if (detail) {
              detail += " / ";
            }

            detail = `${detail}TP: ${millify(
              (Math.abs(sell_order.target_price - sell_order.created_price) /
                sell_order.created_price) *
                100
            )}%`;
          } else {
            if (detail) {
              detail += " / ";
            }
            detail = `${detail}SL: ${millify(
              (Math.abs(sell_order.created_price - sell_order.target_price) /
                sell_order.created_price) *
                100
            )}%`;
          }
        }
        return detail;
      } else {
        return "Buy Dip";
      }
    }
    if (item.type === 0) {
      //TP
      return `TP: ${millify(
        (Math.abs(item.target_price - item.created_price) /
          item.created_price) *
          100
      )}%`;
    } else {
      return `SL: ${millify(
        (Math.abs(item.created_price - item.target_price) /
          item.created_price) *
          100
      )}%`;
    }
  };

  const handleRemove = async (item: any) => {
    let ret = await removeLimitOrder(item._id);
    if (ret) {
      toast.success("Order removed successfully");
      props.refetch();
    } else {
      toast.error("Order remove failed");
    }
  };

  const OrderSkeletonRow = () => {
    return (
      <div className="row py-2 md:py-4 gap-4">
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <div></div>
      </div>
    );
  };

  return (
    <div className="allOrderTable flex flex-col w-full min-w-max">
      <div className="row text-gray py-4">
        <div></div>
        <div>Token</div>
        <div>Amount</div>
        <div>Condition</div>
        <div>Created When</div>
        <div>Target Price</div>
        <div>Triggered At</div>
        <div>Status</div>
        <div>Sllipage</div>
        <div>Priority</div>
        <div>Created</div>
        <div></div>
      </div>
      <div className="body flex flex-col gap-1">
        {!props.data ? (
          <>
            <OrderSkeletonRow />
            <OrderSkeletonRow />
            <OrderSkeletonRow />
            <OrderSkeletonRow />
            <OrderSkeletonRow />
          </>
        ) : (
          props.data?.map((item: ILimitOrder, index: number) => (
            <div className="row py-2 md:py-4" key={index}>
              <div className="flex items-center">
                <TrashIcon
                  className="w-5 h-5 text-gray cursor-pointer"
                  onClick={() => handleRemove(item)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/pair/${item.poolAddress}`} className="text-primary">
                  {item.symbol}
                </Link>
                <ClipboardDocumentIcon
                  className="size-4 text-gray cursor-pointer"
                  onClick={(e) => {
                    handleCopyTokenAddress(item.tokenAddress ?? "");
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                {!item.type ? ( //buy order
                  <img src="/assets/icons/solana.png" className="size-5" />
                ) : (
                  <img src={item.logo} className="size-5 rounded-full" />
                )}
                <span>{item.amount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray">{getCondition(item)}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/solana.png" className="size-5" />
                  <span>
                    ${millify(item?.created_price || 0, { precision: 6 })}
                  </span>
                </div>
                <span className="text-sm text-gray">
                  MC ${millify(item?.created_mcap || 0)}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/solana.png" className="size-5" />
                  <span>
                    ${millify(item?.target_price || 0, { precision: 6 })}
                  </span>
                </div>
                <span className="text-sm text-gray">
                  MC ${millify(item?.target_mcap || 0)}
                </span>
              </div>
              <div className="flex flex-col">
                {item.triggeredAt
                  ? `$${millify(item.triggeredAt, { precision: 6 })}`
                  : ""}
              </div>
              <div className="flex flex-col">
                <span className="text-green">{getStatusContent(item)}</span>
              </div>
              <div className="flex flex-col">{item.slippage}%</div>
              <div className="flex flex-col">{item.trxPriority}</div>
              <div className="flex flex-col">
                {new Date(item?.timeStamp || 0).toLocaleString()}
              </div>
              <div className="flex flex-col items-center">
                {item.trxId && (
                  <a
                    href={`https://solscan.io/tx/` + item.trxId}
                    target="_blank"
                    className="flex gap-2 items-center md:hover:text-blue"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
