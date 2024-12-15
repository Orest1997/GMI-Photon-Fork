import Skeleton from "react-loading-skeleton";
import { ILeaderboard } from "../../interface";
import { shortenAddress, formatNumber } from "../../libs/utils";
import { useAccountInfo } from "../../providers/AppContext";

export default function LeaderboardTable() {
  const { useLeaderboard } = useAccountInfo();
  const { data: leaderboards, isFetching } = useLeaderboard();

  const LeaderboardSkeletonRow = () => {
    return (
      <div className="row py-2 md:py-4">
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <div></div>
      </div>
    );
  };
  return (
    <div className="leaderboardTable flex flex-col w-full text-sm font-semibold">
      <div className="row text-gray py-2">
        <div>Ranking</div>
        <div>Wallet</div>
        <div>Total Points</div>
        <div>Week Points</div>
      </div>
      <div className="body flex flex-col gap-1">
        {isFetching ? (
          <>
            <LeaderboardSkeletonRow />
            <LeaderboardSkeletonRow />
            <LeaderboardSkeletonRow />
            <LeaderboardSkeletonRow />
            <LeaderboardSkeletonRow />
          </>
        ) : (
          leaderboards?.map((leaderboard: ILeaderboard, index) => (
            <div className="row py-2 md:py-4" key={index}>
              <div className="flex">
                <div className="text-center w-12">{index + 1}</div>
              </div>
              <div>{shortenAddress(leaderboard.deposit_wallet)}</div>
              <div>{formatNumber(leaderboard.totalPoint, 4)}</div>
              <div>{formatNumber(leaderboard.weeklyPoint, 4)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
