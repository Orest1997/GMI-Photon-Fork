import { InformationCircleIcon, LinkIcon } from "@heroicons/react/24/solid";
import Card from "../../components/common/Card";
import Tooltip from "../../components/common/Tooltip";
import LeaderboardTable from "../../components/tables/LeaderboardTable";
import MyStats from "./MyStats";
import { Link } from "react-router-dom";
import CheckBox from "../../components/common/CheckBox";
import { Button } from "@headlessui/react";
import { useAccountInfo } from "../../providers/AppContext";
import { IMission } from "../../interface";
import { updateMission } from "../../libs/fetches";
import { toast } from "react-toastify";
import { formatDuration } from "../../libs/utils";

const WEEK_IN_SEOCONDS = 7 * 24 * 60 * 60;

export default function LeaderBoard() {
  const { useJackpot, useMissions } = useAccountInfo();
  const { data: jackpot } = useJackpot();
  const { data: missions, refetch } = useMissions();

  const onClaim = async (mission: IMission) => {
    const ret = await updateMission(mission.detail.type, mission.detail.tier);
    if (ret) {
      refetch();
      toast.success("You have successfully received your reward!");
    } else {
      toast.error("Your claim has failed!");
    }
  };

  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_420px] gap-4 w-full mt-[20px]">
      <div className="flex flex-col gap-8 common-bg">
        <div className="flex flex-col gap-2 flex-grow">
          <span className="text-2xl font-bold">GMI Points Leaderboard</span>
          <span className="text-gray font-medium text-sm">
            Accumulate GMI points by trading and fulfilling missions.
          </span>
        </div>

        <MyStats />

        <div className="flex flex-col gap-2 rounded-xl">
          <span className="font-bold">Leaderboard</span>
          <LeaderboardTable />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-1 h-fit gap-4">
        <div className="flex flex-col gap-4 common-bg">
          <div className="flex gap-2">
            <img src="/assets/icons/cup.svg" />
            <span className="font-bold text-lg">Weekly Jackpot</span>
            <Tooltip
              content={
                "The higher up on the top 100 you are, the more you receive from the jackpot! Jackpot amount may change as trading volume increase."
              }
            >
              <InformationCircleIcon className="size-3 text-gray" />
            </Tooltip>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-3xl font-bold">
              {jackpot?.jackpot ? Number(jackpot.jackpot).toLocaleString() : 0}{" "}
              pts
            </span>
            <span className="text-gray text-smd">
              Distributed to top 100 traders in{" "}
              {formatDuration(
                WEEK_IN_SEOCONDS - (jackpot?.passedTime || 0) / 1000
              )}
            </span>
          </div>
          <div className="flex justify-center">
            <Link
              to={"/referral"}
              className="flex gap-1 items-center bg-[#FFFFFF1A] px-4 py-2 rounded-lg font-semibold"
            >
              <LinkIcon className="size-4" />
              <span>Referral Tracking</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 common-bg">
          <div className="flex gap-2">
            <img src="/assets/icons/mission.svg" />
            <span className="font-bold text-lg">Missions</span>
            <Tooltip
              content={
                "Complete the following missions in order to see new ones."
              }
            >
              <InformationCircleIcon className="size-3 text-gray" />
            </Tooltip>
          </div>
          <div className="flex flex-col">
            {missions?.map((mission: IMission) => (
              <div className="flex gap-2 py-1">
                <div className="flex items-center">
                  <CheckBox initialEnabled={mission.permission} readonly />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-smd">{mission.detail.content}</span>
                  <span className="text-gray text-smd">
                    {mission.detail.point_amount} points
                  </span>
                </div>
                <div
                  className="flex items-center"
                  onClick={() => onClaim(mission)}
                >
                  {mission.permission ? (
                    <Button className="primary">Claim</Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <span className="text-gray text-smd">
            GMI may update points when required to keep the Leaderboard system
            fair.
          </span>
        </div>
      </div>
    </div>
  );
}
