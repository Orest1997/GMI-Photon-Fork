import {
  ClipboardDocumentIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Tooltip from "../../components/common/Tooltip";
import { IPoolOverview } from "../../interface";
import millify from "millify";
import FormattedNumber from "../../components/common/FormattedNumber";
import { Link } from "react-router-dom";

type Props = {
  poolInfo?: IPoolOverview;
  onCopy?: (event: React.MouseEvent<SVGElement>) => void;
};

export default function PoolInfo(props: Props) {
  return (
    <div className={`flex flex-col px-2 py-4 gap-4 font-semibold`}>
      <div className="flex gap-2">
        <div className="flex items-center h-full">
          {props?.poolInfo?.baseImage ? (
            <img
              src={props?.poolInfo?.baseImage}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <img
              src={"/assets/icons/solana.png"}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-lg">
            <span>{props.poolInfo?.baseName || "N/A"}</span>
            <ClipboardDocumentIcon
              className="text-gray size-4 cursor-pointer"
              onClick={props.onCopy}
            />
            <Tooltip
              content={
                <div className="grid grid-cols-[100px_1fr] gap-1">
                  <span className="text-gray text-left">Mint Authority</span>
                  <span className="text-right">Disabled</span>
                  <span className="text-gray text-left">Freeze Authority</span>
                  <span className="text-right">Disabled</span>
                  <span className="text-gray text-left">LP Burned</span>
                  <span className="text-right">100.00%</span>
                  <span className="text-gray text-left">Top 10 Holders</span>
                  <span className="text-right">23.23%</span>
                </div>
              }
            >
              <InformationCircleIcon className="text-gray size-4 cursor-pointer" />
            </Tooltip>
          </div>
          <div className="flex gap-1 text-sm text-gray font-normal">
            <span>PumpFun</span>
            <span className="text-border">|</span>
            <span>Verify Profile</span>
          </div>
        </div>
      </div>

      <div className="flex px-4 justify-between items-center">
        <span className="text-sm text-gray">Form Contract</span>
        <div className="flex gap-4">
          {props?.poolInfo?.baseExtensions.website && (
            <Link to={props?.poolInfo?.baseExtensions.website}>
              <img src="/assets/icons/website.svg" className="size-6" />
            </Link>
          )}
          {props?.poolInfo?.baseExtensions.twitter && (
            <Link to={props?.poolInfo?.baseExtensions.twitter}>
              <img src="/assets/icons/twitter.svg" className="size-6" />
            </Link>
          )}
          {props?.poolInfo?.baseExtensions.telegram && (
            <Link to={props?.poolInfo?.baseExtensions.telegram}>
              <img src="/assets/icons/telegram.svg" className="size-6" />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 text-sm p-4 gap-4">
        <div className="flex flex-col">
          <span className="font-normal">Price USD</span>
          {props?.poolInfo ? (
            <FormattedNumber
              value={props.poolInfo.price}
              options={{ precision: 4 }}
              isCurrency={true}
            />
          ) : (
            <>'N/A'</>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-normal">Liquidity</span>
          <span>
            {props?.poolInfo ? `$${millify(props.poolInfo.liquidity)}` : "N/A"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-normal">MKT CAP</span>
          <span>
            {props?.poolInfo ? `$${millify(props.poolInfo.mcap)}` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
