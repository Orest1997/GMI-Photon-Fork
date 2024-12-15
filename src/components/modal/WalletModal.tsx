import React, { useEffect } from "react";
import Modal from ".";
import ActionButton from "../buttons/ActionButton";
import {
  ArrowRightStartOnRectangleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccountInfo } from "../../providers/AppContext";
import { copyToClipboard, shortenAddress } from "../../libs/utils";
import { Adapter } from "@solana/wallet-adapter-base";

interface WalletModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect?: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ open, setOpen }) => {
  const { select, wallets, publicKey, connected, wallet } = useWallet();
  const { disconnectWallet } = useAccountInfo();

  const handleWalletConnect = async (walletAdapter: Adapter) => {
    try {
      select(walletAdapter.name);
      setOpen(false);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const handleCopyAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (publicKey) {
      copyToClipboard(publicKey?.toBase58(), () => {
        toast.success("Address copied");
      });
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDisconnect = (event: React.MouseEvent<HTMLButtonElement>) => {
    disconnectWallet();
    setOpen(false);
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Modal
      isOpen={open}
      closeModal={() => {
        setOpen(false);
      }}
      title="Connect Wallet"
    >
      <hr className="my-3 text-light-gray" />
      <div className="grid grid-cols-1 gap-4 my-2 mt-6 rounded-sm">
        {wallets.filter((wallet) => wallet.readyState === "Installed").length >
        0 ? (
          <>
            {wallets
              .filter((wallet) => wallet.readyState === "Installed")
              .map((item, index) => (
                <div
                  className={`flex items-center p-3 transition-all rounded-md cursor-pointer hover:bg-semi-white active:scale-[98%] select-none gap-2 ${
                    connected && wallet?.adapter.name === item?.adapter.name
                      ? "bg-[#FFFFFF10] border border-light-gray"
                      : ""
                  }`}
                  onClick={() => {
                    handleWalletConnect(item.adapter);
                  }}
                  key={index}
                >
                  <img src={item?.adapter.icon} className="w-10 h-10" />
                  <span className="flex-grow text-white">
                    {" "}
                    {connected && wallet?.adapter.name === item?.adapter.name
                      ? shortenAddress(publicKey?.toBase58())
                      : item?.adapter.name}{" "}
                  </span>
                  {connected && wallet?.adapter.name === item?.adapter.name ? (
                    <>
                      <ActionButton
                        className="border-none bg-transparent !p-0"
                        onClick={handleCopyAddress}
                      >
                        <ClipboardDocumentIcon className="size-5" />
                      </ActionButton>
                      <ActionButton
                        className="border-none bg-transparent !p-0"
                        onClick={handleDisconnect}
                      >
                        <ArrowRightStartOnRectangleIcon className="size-5" />
                      </ActionButton>
                    </>
                  ) : null}
                </div>
              ))}
          </>
        ) : (
          <div></div>
        )}
      </div>
    </Modal>
  );
};

export default WalletModal;
