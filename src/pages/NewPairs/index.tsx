import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import PairFilter from "../../components/filters/PairFilter";
import { useRef, useState } from "react";
import DexesFilter from "../../components/filters/DexesFilter";
import ToggleButton from "../../components/buttons/ToggleButton";
import PairTable from "../../components/tables/PairTable";
import { useClickAway } from "react-use";
import { useAccountInfo } from "../../providers/AppContext";
import SearchToken from "./SearchToken";
import { NavItem } from "./NavItem";

import Background from "../Home/Background";
import { Button } from "@headlessui/react";
import CreateTokenModal from "../../components/modal/CreateTokenModal";
import { Link } from "react-router-dom";

export default function NewPairs() {
  const { quickBuyAmount, setQuickBuyAmount, chain, setChain } =
    useAccountInfo();

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showDexes, setShowDexes] = useState<boolean>(false);

  const refFilter = useRef(null);
  const refDexes = useRef(null);

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

  return (
    <div className="relative flex flex-col md:grid md:grid-cols-[260px_1fr] gap-2 md:gap-8 min-h-screen py-[20px] overflow-x-visible overflow-y-hidden">
      <div className="common-bg flex flex-col h-fit md:h-full gap-[16px] ">
        <div className="hidden md:flex flex-col gap-[16px]">
          <NavItem logo="assets/icons/hearticon.svg" title="wishlist"></NavItem>
          <NavItem logo="assets/icons/alarmicon.svg" title="alerts"></NavItem>
          <NavItem
            logo="assets/icons/newpairicon.svg"
            title="new pairs"
            selected={true}
          ></NavItem>
          <NavItem
            logo="assets/icons/barcharticon.svg"
            title="gainers"
          ></NavItem>
          <NavItem
            logo="assets/icons/combochaticon.svg"
            title="trendings"
          ></NavItem>
        </div>

        <hr className="hidden md:flex w-full border border-[#FFFFFF80]"></hr>
        <div className="hidden md:flex flex-col gap-[16px]">
          <NavItem
            logo="assets/icons/solana.png"
            title="solana"
            selected={chain === "solana"}
            onClick={() => setChain("solana")}
          ></NavItem>
          <NavItem
            logo="assets/icons/ethereum.png"
            title="ethereum"
            selected={chain === "ethereum"}
            onClick={() => setChain("ethereum")}
          ></NavItem>
          <NavItem
            logo="assets/icons/ton.png"
            title="ton"
            selected={chain === "ton"}
            onClick={() => setChain("ton")}
          ></NavItem>
          <NavItem
            logo="assets/icons/sui.png"
            title="sui"
            selected={chain === "sui"}
            onClick={() => setChain("sui")}
          ></NavItem>
        </div>

        <div className="flex md:hidden justify-between">
          <NavItem
            logo="assets/icons/solana.png"
            selected={chain === "solana"}
            onClick={() => setChain("solana")}
          ></NavItem>
          <NavItem
            logo="assets/icons/ethereum.png"
            selected={chain === "ethereum"}
            onClick={() => setChain("ethereum")}
          ></NavItem>
          <NavItem
            logo="assets/icons/ton.png"
            selected={chain === "ton"}
            onClick={() => setChain("ton")}
          ></NavItem>
          <NavItem
            logo="assets/icons/sui.png"
            selected={chain === "sui"}
            onClick={() => setChain("sui")}
          ></NavItem>
        </div>
      </div>

      <div className="common-bg flex flex-col max-w-full gap-4">
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold">New Pairs</span>
            <span className="text-gray font-medium text-sm">
              Real-time updates for new token pairs added in the last 24-hours.
            </span>
          </div>
          <Link to={"/create"} className="hidden lg:block">
            <Button className="primary">
              <span className="whitespace-nowrap">+ Create Token</span>
            </Button>
          </Link>
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
                <div className="w-32 border border-gray focus-within:border-outline rounded-full flex items-center px-2 h-10 gap-1">
                  <img src={`/assets/icons/${chain}.png`} className="h-6 w-6" />
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
          {chain === "solana" ? <PairTable /> : null}
        </div>
      </div>
    </div>
  );
}
