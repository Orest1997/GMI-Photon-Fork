import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { ITxData } from "../../interface";
import Skeleton from "react-loading-skeleton";
import { shortenAddress } from "../../libs/utils";

interface DepositProps {
  data: ITxData[] | null | undefined;
  isFetching: boolean;
}

export default function DepositTable(props: DepositProps) {
  const DepositSkeletonRow = () => {
    return (
      <div className="row py-2 md:py-4 gap-4">
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
    <div className="depositTable flex flex-col w-full min-w-max">
      <div className="row text-gray py-2">
        <div>Deposit Amount</div>
        <div>Wallet To</div>
        <div>Date</div>
        <div>Status</div>
        <div></div>
      </div>
      <div className="body flex flex-col gap-1">
        {props.isFetching ? (
          <>
            <DepositSkeletonRow />
            <DepositSkeletonRow />
            <DepositSkeletonRow />
            <DepositSkeletonRow />
            <DepositSkeletonRow />
          </>
        ) : (
          props.data?.map((item) => (
            <>
              <div className="row py-2 md:py-4">
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/solana.png" className="size-5" />
                  <span>{item.from_amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{shortenAddress(item.fromMint)}</span>
                </div>
                <div className="flex flex-col">
                  {new Date(item.timeStamp).toLocaleString()}
                </div>
                <div className="flex flex-col">
                  {item.trxId ? (
                    <span className="text-primary">Success</span>
                  ) : (
                    <span className="text-red">Failed</span>
                  )}
                </div>
                <div className="grid grid-cols-2 items-center text-gray">
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
            </>
          ))
        )}
      </div>
    </div>
  );
}
