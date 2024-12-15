import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import Loading from "../components/common/Loading";
import WalletModal from "../components/modal/WalletModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccountInfo } from "../providers/AppContext";
import Background from "../pages/Home/Background";

const PageTitleSetter = () => {
  const location = useLocation();

  const routeTitles = {
    "/": "Home",
    "/account": "Account",
    "/discover": "Trading",
    "/holding": "Holding",
    "/order": "Order",
    "/transfer_funds": "Transfer Funds",
    "/referral": "Referral",
  };

  useEffect(() => {
    const prevTitle = localStorage.getItem("title") || "GMI";

    const pageTitle =
      routeTitles[location.pathname as keyof typeof routeTitles];
    const title = pageTitle ? `${pageTitle} | GMI` : prevTitle;

    if (document.title === title) return;

    document.title = title;
    localStorage.setItem("title", title);
  }, [location]);

  return null;
};

export default function PageLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { isSign } = useAccountInfo();

  const [searchParams] = useSearchParams();

  const referral = searchParams.get("referral");
  if (referral) {
    localStorage.setItem("GMI_REFERRAL", referral);
  }

  if (connected && isSign && pathname === "/") {
    navigate("/discover");
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="absolute top-0 left-0 z-0">
        <Background />
      </div>
      <div className="px-5 md:px-12 flex flex-col h-full">
        <Loading />
        <ToastContainer
          theme="dark"
          position="top-center"
          pauseOnFocusLoss={false}
          autoClose={2000}
          hideProgressBar
          toastClassName="bg-toast"
          closeOnClick
          stacked
          className="z-[10000]"
        />

        <Header />

        <PageTitleSetter />

        <div className="w-full flex-grow relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
