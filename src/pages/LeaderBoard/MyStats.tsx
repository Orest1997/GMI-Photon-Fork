import { InformationCircleIcon } from "@heroicons/react/24/solid";
import Card from "../../components/common/Card";
import Tooltip from "../../components/common/Tooltip";
import { useAccountInfo } from "../../providers/AppContext";
import millify from "millify";
import { useEffect } from "react";

export default function MyStats() {
  const { useUserInfo } = useAccountInfo();
  const { data: userInfo, refetch: userRefetch } = useUserInfo();

  useEffect(() => {
    if (!userRefetch) return;
    userRefetch();
  }, []);

  return (
    <div className="flex flex-col py-4 gap-2 rounded-xl">
      <span className="font-bold">Your Stats</span>
      <div className="grid grid-cols-2 md:grid-cols-3 py-4 gap-4">
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Ranking</span>
            <Tooltip
              content={
                "Your rank on the leaderboard for the current 7-days cycle"
              }
            >
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">{userInfo?.ranking}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Total Points</span>
            <Tooltip
              content={"Total of all GMI points that you've accumulated"}
            >
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">
            {millify(userInfo?.totalPoint || 0, { precision: 2 })}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Week Points</span>
            <Tooltip
              content={"GMI points that you've earned for the past 7 days"}
            >
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">
            {millify(userInfo?.weeklyPoint || 0, { precision: 2 })}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Trading Volume</span>
            <Tooltip content={"Total volume of tokens you've trade on GMI"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">
            {millify(userInfo?.tradingVolume || 0, { precision: 2 })}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Trader Referrals</span>
            <Tooltip
              content={"# of people you referred who have traded at least once"}
            >
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">
            {userInfo?.traderReferrals || 0}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>GMI Shares</span>
            <Tooltip content={"# of times you've shared your GMI gains"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">
            {millify(userInfo?.gainShare || 0, { precision: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
