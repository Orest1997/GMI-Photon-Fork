import { Button } from "@headlessui/react";
import moment from "moment";
import {
  copyToClipboard,
  formatShortMoment,
  shortenAddress,
} from "../../libs/utils";
import { ClipboardDocumentIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useWebsocket } from "../../providers/WebsocketProvider";
import { IPoolOverview } from "../../interface";
import millify from "millify";
import { useTokenData } from "../../providers/TokenData";
import { useAccountInfo } from "../../providers/AppContext";
import FormattedNumber, { formatNumber } from "../common/FormattedNumber";

export const SCORE_TIME: { [key: string]: string } = {
  "5": "5m",
  "60": "1h",
  "360": "6h",
  "1440": "24h",
};

export const SORT_TYPE = [
  "score", //Rank
  "price",
  "liquidity",
  "mcap",
  "volume",
  "txns",
  "ratio", //price change
  "makers",
  "buyers",
  "sellers",
];

export default function PairTable() {
  const { quickBuyAmount } = useAccountInfo();
  const { SOL_PRICE, usePoolList } = useTokenData();
  const { ws_search } = useWebsocket();
  const [scoreTime, setScoreTime] = useState(SCORE_TIME["5"]);
  const [sortType, setSortType] = useState(SORT_TYPE[0]);
  // const [pairs, setPairs] = useState([]);

  const { data: pairs, refetch } = usePoolList(
    scoreTime,
    0,
    20,
    sortType,
    "desc",
    5
  );

  const onQuickBuy = (pair: IPoolOverview) => {
    if (!quickBuyAmount) return;
  };

  const handleCopyTokenAddress = (text: string) => {
    copyToClipboard(text, () => {
      toast.success("Successfuly copied");
    });
  };

  // useEffect(() => {
  //   if (!ws_search) return;

  //   ws_search.sendMessage("subscribe", {
  //     type: "SUBSCRIBE_RANK_PAIRS",
  //     data: {
  //       duration: scoreTime,
  //       sort: sortType,
  //       sort_dir: "desc",
  //       skip: 0,
  //       limit: 50,
  //     },
  //   });

  //   const listenerId = ws_search.registerListener("message", (data: any) => {
  //     if (data.type === "PAIRS_DATA" && data.data) {
  //       setPairs(data.data);
  //     }
  //   });

  //   return () => ws_search?.removeListener(listenerId);
  // }, [ws_search]);

  return (
    <div className="pairTable flex flex-col w-full min-w-max">
      <div className="header row">
        <div className="w-0"></div>
        <div className="pl-4">Token</div>
        <div className="w-20">Price</div>
        <div className="w-20">Age</div>
        <div>Liquidity</div>
        <div>MKT CAP</div>
        <div>TXNS</div>
        <div>Volume</div>
        <div className="text-center">Action</div>
      </div>
      <div className="body flex flex-col gap-1">
        {pairs && pairs.length > 0 ? (
          <>
            {pairs.map((pair: IPoolOverview) => {
              // if (!pair.baseName) return null;
              return (
                <Link
                  to={`/pair/${pair.poolAddress}`}
                  className="row"
                  key={pair.poolAddress}
                >
                  <div className="h-16"></div>
                  <div className="flex items-center gap-2">
                    {pair.baseImage ? (
                      <img
                        src={pair.baseImage}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <img
                        src={"/assets/icons/solana.png"}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {pair.baseSymbol}
                        <span className="text-gray"> / {pair.quoteSymbol}</span>
                      </span>
                      <div className="flex items-center text-xs text-gray">
                        <span>{shortenAddress(pair.baseMint)}</span>
                        <ClipboardDocumentIcon
                          className="size-3 cursor-pointer"
                          onClick={(e) => {
                            handleCopyTokenAddress(pair.baseMint);
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </div>
                      <div className="flex gap-1 pt-1 items-center">
                        {pair.baseExtensions.website && (
                          <Link to={pair.baseExtensions.website}>
                            <img
                              src="/assets/icons/website.svg"
                              className="size-3"
                            />
                          </Link>
                        )}
                        {pair.baseExtensions.twitter && (
                          <Link to={pair.baseExtensions.twitter}>
                            <img
                              src="/assets/icons/twitter.svg"
                              className="size-3"
                            />
                          </Link>
                        )}
                        {pair.baseExtensions.telegram && (
                          <Link to={pair.baseExtensions.telegram}>
                            <img
                              src="/assets/icons/telegram.svg"
                              className="size-3"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <FormattedNumber
                      value={pair.price}
                      options={{ precision: 4 }}
                      isCurrency={true}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="size-3" />
                    <span>{formatShortMoment(pair.created * 1000)}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <img src="/assets/icons/solana.png" className="size-4" />
                      <span className="text-sm">
                        {millify(pair.liquidity / (SOL_PRICE ?? 200))}
                      </span>
                      <span className="text-sm">
                        {" "}
                        / ${millify(pair.liquidity)}
                      </span>
                    </div>
                    <span className="text-primary text-xs">
                      {millify(pair.v24hChangePercent)}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">${millify(pair.mcap)}</span>
                  </div>
                  <div>
                    <span className="text-sm">{pair.trade5m}</span>
                  </div>
                  <div>
                    <span className="text-sm">{millify(pair.v24hUSD)}</span>
                  </div>

                  <div className="flex items-center justify-center">
                    {quickBuyAmount && (
                      <Button
                        className="primary"
                        onClick={(e: any) => {
                          onQuickBuy(pair);
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        Buy
                      </Button>
                    )}
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          <div className="row h-16">
            <div></div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
