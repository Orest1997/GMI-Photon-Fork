import { Button } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import { useAccountInfo } from "../providers/AppContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRef, useState } from "react";
import millify from "millify";
import { isMobile } from "react-device-detect";
import { useClickAway } from "react-use";
import {
  ArrowRightStartOnRectangleIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  UserCircleIcon,
  UsersIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import SelectChain from "./SelectChain";
import WalletModal from "../components/modal/WalletModal";

export default function Header() {
  type NavLinkProps = {
    isActive: boolean;
  };
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const { connected } = useWallet();
  const { useUserInfo, isSign, disconnectWallet, chain } = useAccountInfo();
  const [show, setShow] = useState(false);
  const { data: userInfo } = useUserInfo();

  const getActiveLinkClass = ({ isActive }: NavLinkProps) =>
    isActive ? "text-[#00F3E7]" : "";

  useClickAway(ref, () => setShow(false));

  return (
    <header className="flex items-center justify-between px-4 py-8">
      <Link
        to={connected && isSign ? "/discover" : "/"}
        className="flex items-center cursor-pointer select-none"
      >
        <img
          src="/assets/images/logo.png"
          alt="logo"
          className="mr-1 h-[2rem] md:h-[3rem] hidden sm:block"
        />
        <img
          src="/assets/icons/logo.svg"
          alt="logo"
          className="mr-1 h-[2rem] md:h-[3rem] sm:hidden"
        />
      </Link>

      {connected && isSign ? (
        <nav className="top-bar text-gray rounded-full px-12 py-2">
          <NavLink to="/" className={getActiveLinkClass}>
            Home
          </NavLink>
          {/* <NavLink to="/discover" className={getActiveLinkClass}>
            New Pairs
          </NavLink> */}
          <NavLink to="/create" className={getActiveLinkClass}>
            Create
          </NavLink>
          <NavLink to="/discover" className={getActiveLinkClass}>
            Trading
          </NavLink>
          {/* <NavLink to="/memescope" className={getActiveLinkClass}>
            Memescope
          </NavLink> */}
          <NavLink to="/order" className={getActiveLinkClass}>
            Orders
          </NavLink>
          <NavLink to="/holding" className={getActiveLinkClass}>
            Holdings
          </NavLink>
          <NavLink to="/leaderboard" className={getActiveLinkClass}>
            LeaderBoard
          </NavLink>
        </nav>
      ) : null}

      <div className="flex gap-4">
        <SelectChain />

        {connected && isSign ? (
          <div className="items-center flex gap-2">
            <div className="flex gap-5 items-center">
              <Link to={"/transfer_funds"} className="flex flex-col">
                <img
                  src="/assets/icons/wallet.svg"
                  className="size-5"
                  alt="wallet"
                />
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <img
                      src={`/assets/icons/${chain}.png`}
                      className="size-4"
                    />
                    <span className="text-sm">
                      {millify(userInfo ? userInfo?.sol_balance || 0 : 0, {
                        precision: 4,
                      })}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="relative">
                <UserCircleIcon
                  className="size-10 cursor-pointer"
                  onClick={() => setShow(true)}
                />
                {show && (
                  <div
                    className="popover-menu top-12"
                    onClick={() => setShow(false)}
                    ref={ref}
                  >
                    <Link
                      to={"/referral"}
                      className="flex gap-2 hover:bg-[#26174A] hover:bg-opacity-70 p-2"
                    >
                      <UsersIcon className="size-6" />
                      <span className="whitespace-nowrap">
                        Referral Tracking
                      </span>
                    </Link>
                    <Link
                      to={"/transfer_funds"}
                      className="flex gap-2 hover:bg-[#26174A] hover:bg-opacity-70 p-2"
                    >
                      <CurrencyDollarIcon className="size-6" />
                      <span className="whitespace-nowrap">Transfer Funds</span>
                    </Link>
                    <Link
                      to={""}
                      className="flex gap-2 hover:bg-[#26174A] hover:bg-opacity-70 p-2"
                      target="_blank"
                    >
                      <DocumentIcon className="size-6" />
                      <span className="whitespace-nowrap">Documentation</span>
                    </Link>
                    <div
                      className="flex gap-2 hover:bg-[#26174A] hover:bg-opacity-70 p-2"
                      onClick={() => {
                        disconnectWallet();
                      }}
                    >
                      <ArrowRightStartOnRectangleIcon className="size-6" />
                      <span className="whitespace-nowrap">Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center border border-[#00F3E7] rounded-full size-10"
            onClick={() => setOpen(true)}
          >
            <img
              src="/assets/icons/wallet.svg"
              className="size-6"
              alt="wallet"
            />
          </div>
        )}
      </div>

      {open && <WalletModal open={open} setOpen={setOpen} />}
    </header>
  );
}
