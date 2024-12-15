import {
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { IHoldingToken } from "../../interface";
import millify from "millify";
import Skeleton from "react-loading-skeleton";
import { buySellColor, copyToClipboard } from "../../libs/utils";
import { toast } from "react-toastify";
import FormattedNumber from "../common/FormattedNumber";
import { cn } from "../../helpers/utils";

interface HoldingProps {
  data: IHoldingToken[] | null | undefined;
  isFetching: boolean;
  toggleShow: (item: IHoldingToken) => void;
}

export default function HoldingTable(props: HoldingProps) {
  const handleCopyTokenAddress = (address: string) => {
    copyToClipboard(address, () => {
      toast.success("Successfuly copied");
    });
  };

  const HoldingSkeletonRow = () => {
    return (
      <div className="row py-2 md:py-4 gap-4">
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
    <div className="holdingTable flex flex-col w-full min-w-max">
      <div className="row text-gray py-2">
        <div>Token</div>
        <div>Invested</div>
        <div>Remaining</div>
        <div>Sold</div>
        <div>Change in P&L</div>
        <div></div>
      </div>
      <div className="body flex flex-col gap-1">
        {props.isFetching ? (
          <>
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
          </>
        ) : (
          props.data?.map((item, index) => (
            <div
              className={cn(
                "row py-1 md:py-2",
                item.hidden ? "opacity-50" : ""
              )}
              key={index}
            >
              <div className="flex items-center gap-2">
                <Link to={`/pair/${item.poolAddress}`} className="text-primary">
                  {item.symbol}
                </Link>
                <ClipboardDocumentIcon
                  className="size-4 text-gray cursor-pointer"
                  onClick={(e) => {
                    handleCopyTokenAddress(item.mint);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <img src="/assets/icons/solana.png" className="size-5" />
                <span>{item.invest}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img src={item.logo} className="size-5 rounded-full" />
                  <span>{millify(item.remain, { precision: 3 })}</span>
                </div>
                {/* <span className="text-sm text-gray">0</span> */}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/icons/solana.png"
                    className="size-5 rounded-full"
                  />
                  <span>{millify(item.sold, { precision: 3 })}</span>
                </div>
                {/* <span className="text-sm text-gray">1M</span> */}
              </div>
              <div className="flex flex-col">
                <FormattedNumber
                  className={cn(buySellColor(item.pnl))}
                  value={item.pnl}
                  options={{ precision: 2 }}
                  isPercent={true}
                />
                <FormattedNumber
                  className={cn(
                    buySellColor(item.sold - item.invest),
                    "text-sm"
                  )}
                  value={item.sold - item.invest}
                  options={{ precision: 3 }}
                />
              </div>
              <div className="grid grid-cols-2 items-center text-gray">
                <span>{item.remain === 0 ? "Sold" : ""}</span>
                <div
                  className="flex justify-end cursor-pointer"
                  onClick={() => props.toggleShow(item)}
                >
                  {item.hidden ? (
                    <EyeSlashIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
