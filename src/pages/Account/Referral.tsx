import { Button } from "@headlessui/react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Tooltip from "../../components/common/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useAccountInfo } from "../../providers/AppContext";
import { copyToClipboard } from "../../libs/utils";
import { toast } from "react-toastify";
import millify from "millify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTokenPrice } from "../../libs/fetches";
import { DEFAULT_TOKEN, USDC_TOKEN_ADDRESS } from "../../helpers/config";

export default function Referral() {
  const { useUserInfo } = useAccountInfo();
  const { data: userInfo } = useUserInfo();

  const { data: SOL_PRICE } = useQuery<number>({
    queryKey: ["SOL_PRICE"],
    queryFn: async () =>
      (await fetchTokenPrice(DEFAULT_TOKEN, USDC_TOKEN_ADDRESS)).price,
  });

  const handleCopyLink = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!userInfo) return;
    copyToClipboard(`https://gmi.io?referral=${userInfo?.referralCode}`, () => {
      toast.success("Copied Referral Link!");
    });
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-12 w-full mt-[20px] common-bg">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">Referrals</span>
        <span className="text-gray font-medium text-sm">
          Track earnings from your referrals in real-time.
        </span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl">
        <span className="font-bold">Your Referral Link</span>
        <div className="flex flex-col py-4 gap-4">
          <span className="text-gray text-sm font-semibold">
            You can use this referral URL.
          </span>
          <div className="flex gap-4 items-center">
            <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              https://gmi.io?referral={userInfo?.referralCode}
            </span>
            <Button
              className="primary whitespace-nowrap"
              onClick={handleCopyLink}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl">
        <span className="font-bold">Your Stats</span>
        <div className="grid grid-cols-3 py-4 gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-gray text-sm font-semibold">
              <span>Referrals</span>
              <Tooltip
                content={"Number of ppl who signed up using your referral link"}
              >
                <InformationCircleIcon className="size-3" />
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-gray text-sm font-semibold">
              <span>Traders</span>
              <Tooltip content={"Number of referrals who traded at least once"}>
                <InformationCircleIcon className="size-3" />
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-gray text-sm font-semibold">
              <span>Total Volume by Traders</span>
              <Tooltip content={"Total combined volume of all your referrals"}>
                <InformationCircleIcon className="size-3" />
              </Tooltip>
            </div>
          </div>

          <span className="font-semibold">{userInfo?.refUsers.length}</span>
          <span className="font-semibold">{userInfo?.traderReferrals}</span>
          <span className="font-semibold">
            ${millify((userInfo?.totalVolumeByTraders || 0) * (SOL_PRICE || 0))}
            <span className="text-gray text-sm ml-1">
              ({millify(userInfo?.totalVolumeByTraders || 0, { precision: 3 })}{" "}
              SOL)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
