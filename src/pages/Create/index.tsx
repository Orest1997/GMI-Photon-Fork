import { Button } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";
import PairFilter from "../../components/filters/PairFilter";
import { useClickAway } from "react-use";
import DexesFilter from "../../components/filters/DexesFilter";
import ToggleButton from "../../components/buttons/ToggleButton";
import { useAccountInfo } from "../../providers/AppContext";
import SearchToken from "../NewPairs/SearchToken";
import TokenTable from "../../components/tables/TokenTable";

export const Create = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showDexes, setShowDexes] = useState<boolean>(false);
  const refFilter = useRef(null);
  const refDexes = useRef(null);
  const { quickBuyAmount, setQuickBuyAmount, chain, setChain } =
    useAccountInfo();

  const handleShowOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const toogleQuickBuy = () => {
    if (quickBuyAmount) {
      setQuickBuyAmount(undefined);
      localStorage.setItem("PRIM_QUICK_ENABLED", "false");
    } else {
      localStorage.setItem("PRIM_QUICK_ENABLED", "true");
      const _amount = localStorage.getItem("PRIM_QUICK_AMOUNT");
      setQuickBuyAmount(_amount ?? "1.0");
    }
  };

  const handleChangeAmount = (e: any) => {
    setQuickBuyAmount(e.target.value);
    localStorage.setItem("PRIM_QUICK_AMOUNT", e.target.value);
  };

  useClickAway(refFilter, () => setShowFilter(false));
  useClickAway(refDexes, () => setShowDexes(false));

  const [showDialog, setShowDialog] = useState(true);

  const handleCreate = () => {
    // create token

    //
    setShowDialog((prev) => !prev);
  };

  return (
    <div className="createToken w-full flex items-center justify-center py-[60px]">
      {showDialog ? (
        <div className="main w-[865px] px-[70px] py-[60px] rounded-[40px] flex flex-col gap-[30px]">
          <span className="text-[42px]">Create a new Token 🔥</span>

          <div className="flex justify-between gap-4">
            <div className="bg-[#00000033] rounded-full px-5 py-2 w-full">
              <input
                className="outline-none bg-transparent w-full"
                placeholder="Name"
              ></input>
            </div>
            <div className="bg-[#00000033] rounded-full px-5 py-2 w-full">
              <input
                className="outline-none bg-transparent w-full"
                placeholder="Ticker"
              ></input>
            </div>
          </div>

          <textarea
            className="bg-[#00000033] p-4 rounded-xl"
            placeholder="Description"
            rows={5}
          ></textarea>

          <div className="flex items-center justify-center gap-2 bg-[#00000033] rounded-xl p-4 cursor-pointer">
            <img src="assets/icons/upload.svg"></img>
            <span>Upload image / video</span>
          </div>

          <div
            className="flex items-center justify-center gap-4 cursor-pointer"
            onClick={handleShowOptions}
          >
            <span className="text-sm">Show Additional Options</span>
            <img
              src="assets/icons/optiondown.svg"
              className={`size-4 ${
                showOptions ? "" : "rotate-180"
              } transition-all`}
            ></img>
          </div>
          {showOptions ? (
            <>
              <div className="flex gap-4">
                <div className="bg-[#00000033] px-5 py-3 rounded-full w-full">
                  <input
                    className="bg-transparent text-[15px] w-full"
                    placeholder="Twitter Link (opt)"
                  ></input>
                </div>
                <div className="bg-[#00000033] px-5 py-3 rounded-full w-full">
                  <input
                    className="bg-transparent text-[15px] w-full"
                    placeholder="Telegram Link (opt)"
                  ></input>
                </div>
              </div>

              <div className="bg-[#00000033] px-5 py-3 rounded-full">
                <input
                  className="bg-transparent text-[15px] w-full"
                  placeholder="Website Link (opt)"
                ></input>
              </div>
            </>
          ) : (
            <></>
          )}

          <button className="hover:scale-105" onClick={handleCreate}>
            Create
          </button>
        </div>
      ) : (
        <div className="background flex flex-col gap-32 items-center w-full">
          <div className="title" onClick={handleCreate}>
            <span className="uppercase w-[200px] text-[2rem] font-semibold text-center">
              create a new token
            </span>
          </div>
          <div className="common-bg flex flex-col max-w-full gap-4 w-full">
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold">Your Tokens</span>
                <span className="text-gray font-medium text-sm">
                  New tokens created in last 24 hours updated in last 24 hours.
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-2">
              <div className="grid lg:grid-cols-[120px_120px_1fr] w-full gap-2">
                <div className="relative">
                  <div
                    className="flex items-center gap-1 border border-outline rounded-full px-4 py-2 cursor-pointer"
                    onClick={() => setShowFilter((prev) => !prev)}
                  >
                    <AdjustmentsHorizontalIcon className="size-4" />
                    <span className="font-semibold flex-grow">Filter</span>
                    <ChevronDownIcon className="size-4" />
                  </div>
                  <div
                    className="absolute z-20 left-0 top-11"
                    hidden={!showFilter}
                    ref={refFilter}
                  >
                    <PairFilter />
                  </div>
                </div>

                <div className="relative z-10">
                  <div
                    className="flex items-center gap-1 border border-outline rounded-full px-4 py-2 cursor-pointer"
                    onClick={() => setShowDexes((prev) => !prev)}
                  >
                    <AdjustmentsHorizontalIcon className="size-4" />
                    <span className="font-semibold flex-grow">Dexes</span>
                    <ChevronDownIcon className="size-4" />
                  </div>
                  <div
                    className="absolute z-20 left-0 top-11"
                    hidden={!showDexes}
                    ref={refDexes}
                  >
                    <DexesFilter />
                  </div>
                </div>

                <div className="flex gap-2">
                  <ToggleButton
                    className="h-full"
                    initialEnabled={quickBuyAmount !== undefined}
                    onSwitchChange={toogleQuickBuy}
                  >
                    <span className="font-semibold">Quick Buy</span>
                  </ToggleButton>
                  {quickBuyAmount !== undefined && (
                    <div className="w-32 border border-gray rounded-full flex items-center px-2 h-10 gap-1">
                      <img src="/assets/icons/solana.png" className="h-6 w-6" />
                      <input
                        className="w-full bg-transparent outline-none mr-2"
                        type="number"
                        value={quickBuyAmount}
                        onChange={handleChangeAmount}
                      />
                    </div>
                  )}
                </div>
              </div>

              <SearchToken />
            </div>

            <div className="flex max-w-full overflow-auto">
              <TokenTable />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
