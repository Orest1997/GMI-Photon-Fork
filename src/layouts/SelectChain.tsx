import { useRef, useState } from "react";
import { useAccountInfo } from "../providers/AppContext";
import { useClickAway } from "react-use";

export default function SelectChain() {
  const { chain, setChain } = useAccountInfo();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const CHAINS: any = {
    solana: {
      name: "SOLANA",
      symbol: "SOL",
      logo: "/assets/icons/solana.png",
    },
    ethereum: {
      name: "ETHEREUM",
      symbol: "ETH",
      logo: "/assets/icons/ethereum.png",
    },
    ton: {
      name: "TON",
      symbol: "TON",
      logo: "/assets/icons/ton.png",
    },
    sui: {
      name: "SUI",
      symbol: "SUI",
      logo: "/assets/icons/sui.png",
    },
  };

  useClickAway(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex items-center rounded-full border border-[rgba(0,243,231,1)] gap-1 pl-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <img src={CHAINS[chain].logo} alt="chain" />
        <span className="w-12">{CHAINS[chain].symbol}</span>
        <img src="/assets/icons/switch.svg" alt="switch" />
      </div>
      {open && (
        <div className="absolute top-12 popover-menu">
          {Object.keys(CHAINS).map((key) => (
            <div
              className={`flex items-center w-max gap-[16px] px-2 py-1 rounded-md cursor-pointer ${
                chain === key
                  ? "bg-[#26174A]"
                  : "bg-transparent hover:bg-[#26174A]"
              }`}
              onClick={() => {
                setChain(key);
                setOpen(false);
              }}
              key={key}
            >
              <img src={CHAINS[key].logo} />
              <span>{CHAINS[key].name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
