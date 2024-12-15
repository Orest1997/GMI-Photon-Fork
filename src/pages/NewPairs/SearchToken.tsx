import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { fetchPools } from "../../libs/fetches";
import { SCORE_TIME, SORT_TYPE } from "../../components/tables/PairTable";
import { IPoolOverview } from "../../interface";
import millify from "millify";
import { formatShortMoment, shortenAddress } from "../../libs/utils";
import { cn } from "../../helpers/utils";
import { Link } from "react-router-dom";
import { useClickAway } from "react-use";
import { useTokenData } from "../../providers/TokenData";

export default function SearchToken() {
  const { SOL_PRICE, useSearchTokens } = useTokenData();
  const [queryFilter, setQueryFilter] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const refFilter = useRef(null);
  const { data: SEARCH_TOKENS } = useSearchTokens(queryFilter);
  useEffect(() => {
    if (SEARCH_TOKENS && SEARCH_TOKENS.length > 0) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }
  }, [SEARCH_TOKENS]);

  useClickAway(refFilter, () => setShowFilter(false));

  return (
    <div className="w-full md:max-w-[280px] border border-gray focus-within:border-outline rounded-full flex items-center px-2 h-10 gap-1 relative">
      <MagnifyingGlassIcon className="size-6" />
      <input
        className="w-full bg-transparent outline-none mr-2"
        placeholder="Search Token"
        value={queryFilter}
        onChange={(e) => setQueryFilter(e.target.value)}
      />

      {showFilter && (
        <div
          className="absolute right-0 top-11 flex flex-col z-10 py-1 rounded-xl bg-[#16181C] border border-[#2E3239] h-[280px] min-w-[320px] overflow-y-auto"
          ref={refFilter}
        >
          {SEARCH_TOKENS &&
            SEARCH_TOKENS.map((pool, index) => {
              if (!pool.baseName) return;

              return (
                <Link
                  to={`/pair/${pool.poolAddress}`}
                  className={cn(
                    "flex flex-col gap-1 px-4 py-3 cursor-pointer hover:bg-dark-gray",
                    index !== SEARCH_TOKENS.length - 1
                      ? "border-b border-[#82858F90]"
                      : ""
                  )}
                  key={index}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        pool.baseImage !== ""
                          ? pool.baseImage
                          : "/assets/icons/solana.png"
                      }
                      className="size-5 rounded-full"
                      alt="logo"
                    />
                    <span className="text-[14px]">{pool.baseName}</span>
                  </div>

                  <div className="grid grid-cols-3 mt-1 items-center text-[13px]">
                    <span>${millify(pool.price, { precision: 4 })}</span>
                    <span className="whitespace-nowrap">
                      <span className="text-gray">PS:</span>{" "}
                      {millify(pool.liquidity / 2 / (SOL_PRICE ?? 200), {
                        precision: 2,
                      })}
                    </span>
                    <span className="whitespace-nowrap">
                      <span className="text-gray">Created:</span>{" "}
                      {formatShortMoment(pool.created * 1000)}
                    </span>
                  </div>

                  <div className="flex flex-col text-[13px] text-gray">
                    <span>Pair: {shortenAddress(pool.poolAddress)}</span>
                    <span>
                      {pool.baseSymbol}: {shortenAddress(pool.baseMint)}
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}
