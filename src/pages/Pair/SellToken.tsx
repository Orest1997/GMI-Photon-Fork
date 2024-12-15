import { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import AdvancedSetting from "./AdvancedSetting";
import { ILimitOrder, IPoolOverview } from "../../interface";
import { useAccountInfo } from "../../providers/AppContext";
import { addLimitOrder, fetchPoolInfo, swapToken } from "../../libs/fetches";
import millify from "millify";
import { DEFAULT_TOKEN } from "../../helpers/config";
import { useTokenData } from "../../providers/TokenData";
import RadioButtons from "../../components/buttons/RadioButtons";
import StopLoss from "./StopLoss";
import TakeProfit from "./TakeProfit";
import { toast } from "react-toastify";
import { formatNumber } from "../../libs/utils";

type Props = {
  poolInfo?: IPoolOverview;
  addTPLine: (order: ILimitOrder) => void;
  addSLLine: (order: ILimitOrder) => void;
};

const SELL_OPTIONS = [
  {
    value: "now",
    label: "Sell Now",
  },
  {
    value: "auto",
    label: "Auto Sell",
  },
];

export default function SellToken(props: Props) {
  const { useUserInfo, isSign, slippage, priority } = useAccountInfo();
  const { useTokenBalance } = useTokenData();
  const { data: userInfo, refetch: userRefetch } = useUserInfo();
  const { data: tokenBalance, refetch } = useTokenBalance(
    userInfo?.deposit_wallet,
    props.poolInfo?.baseMint,
    props.poolInfo?.baseDecimals
  );

  const [amount, setAmount] = useState<string>("");
  const [option, setOption] = useState<string>("now");

  const [type, setType] = useState(0);
  const [isStopLoss, setIsStopLoss] = useState<boolean>(true);
  const [expire, setExpire] = useState("24");
  const [value, setValue] = useState("20.0");

  const handleSellNow = async () => {
    if (props.poolInfo && !isNaN(Number(amount))) {
      toast.success("Sending Transaction...");
      const ret = await swapToken(
        props.poolInfo.poolAddress,
        props.poolInfo.baseMint,
        DEFAULT_TOKEN,
        Number(amount),
        slippage,
        priority
      );
      if (ret) {
        toast.success("Transaction has been confirmed successfully");
        userRefetch();
        refetch();
      } else {
        toast.error("Transaction has been failed");
      }
    }
  };

  const handleSellAuto = async () => {
    if (
      props.poolInfo &&
      !isNaN(Number(value)) &&
      !isNaN(Number(amount)) &&
      !isNaN(Number(expire))
    ) {
      const poolInfo: IPoolOverview = await fetchPoolInfo(
        props.poolInfo.poolAddress
      );
      if (poolInfo) {
        if (Number(amount) <= 0) {
          toast.warning("Input valid amount!");
          return;
        }

        if (Number(expire) <= 0 || Number(expire) > 24) {
          toast.warning("Input valid expire hours(MAX: 24)!");
          return;
        }

        let target_value = Number(value);
        if (type % 2 === 0) {
          if (isStopLoss) {
            target_value = (poolInfo.price * (100 - target_value)) / 100;
            // type === 0
            //   ? (poolInfo.mcap * (100 - target_value)) / 100
            //   : (poolInfo.price * (100 - target_value)) / 100;
          } else {
            target_value = (poolInfo.price * (100 + target_value)) / 100;
            // type === 0
            // ? (poolInfo.mcap * (100 + target_value)) / 100
            // : (poolInfo.price * (100 + target_value)) / 100;
          }
        }
        const trigger_type = 0; //type < 2 ? 1 : 0; // 1: marketcap, 0: price

        let order = {};
        if (isStopLoss) {
          order = {
            sellDipSL: {
              target_value: target_value,
              amount: Number(amount),
              amount_type: 0,
              trigger_type: trigger_type,
            },
          };
        } else {
          order = {
            sellDipTP: {
              target_value: target_value,
              amount: Number(amount),
              amount_type: 0,
              trigger_type: trigger_type,
            },
          };
        }
        const ret = await addLimitOrder(
          poolInfo.poolAddress,
          poolInfo.baseMint,
          Number(expire),
          priority,
          slippage,
          poolInfo.price,
          order
        );
        if (ret) {
          toast.success("Order created successfully!");
          if (isStopLoss) props.addSLLine(ret);
          else props.addTPLine(ret);
        } else {
          toast.error("Order create failed!");
        }
      }
    }
  };

  useEffect(() => {
    if (type % 2 === 0) {
      setValue("20.0");
    } else if (type === 1) {
      setValue(formatNumber(Number(props.poolInfo?.mcap), 4).toString());
    } else {
      setValue(formatNumber(Number(props.poolInfo?.price), 4).toString());
    }
  }, [type]);

  return (
    <div className={`flex flex-col py-4 gap-4 font-semibold`}>
      <RadioButtons
        className="grid grid-cols-2"
        options={SELL_OPTIONS}
        onChange={setOption}
        defaultValue={option}
      />

      {option === "now" ? (
        <div className="flex flex-col gap-4">
          <Input
            label="Balance"
            highlight={`${millify(tokenBalance || 0, { precision: 4 })} ${
              props.poolInfo?.baseSymbol
            }`}
            value={amount}
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
            onHighlight={() => setAmount((tokenBalance || 0).toString())}
          >
            <span className="text-sm">{props.poolInfo?.baseSymbol}</span>
          </Input>

          <div className="grid grid-cols-3 gap-5">
            <Button
              className="third w-full"
              onClick={() => setAmount(`${(tokenBalance || 0) / 4}`)}
            >
              25%
            </Button>
            <Button
              className="third w-full"
              onClick={() => setAmount(`${(tokenBalance || 0) / 2}`)}
            >
              50%
            </Button>
            <Button
              className="third w-full"
              onClick={() => setAmount(`${tokenBalance || 0}`)}
            >
              100%
            </Button>
          </div>
        </div>
      ) : (
        <TabGroup className="w-full bg-mid-gray rounded-xl">
          <TabList className="flex items-center gap-1">
            {["Stop Loss", "Take Profit"].map((tabName) => (
              <Tab
                key={tabName}
                className={({ selected }) =>
                  `flex-grow border-b-2 rounded-none outline-none text-sm px-4 font-semibold ${
                    selected
                      ? "text-soft-white border-b-2  border-primary"
                      : "text-gray border-light-gray"
                  }`
                }
                onClick={() => setIsStopLoss(tabName === "Stop Loss")}
              >
                {tabName}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-2">
            <TabPanel>
              <StopLoss
                type={type}
                symbol={props.poolInfo?.baseSymbol}
                value={value}
                amount={amount}
                balance={tokenBalance}
                expire={expire}
                price={props.poolInfo?.price}
                setType={setType}
                setAmount={setAmount}
                setExpire={setExpire}
                setValue={setValue}
              />
            </TabPanel>
            <TabPanel>
              <TakeProfit
                type={type}
                symbol={props.poolInfo?.baseSymbol}
                value={value}
                amount={amount}
                balance={tokenBalance}
                expire={expire}
                price={props.poolInfo?.price}
                setType={setType}
                setAmount={setAmount}
                setExpire={setExpire}
                setValue={setValue}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}

      <AdvancedSetting />

      {option === "now" ? (
        <Button
          className="secondary w-full justify-center"
          onClick={() => handleSellNow()}
        >
          Quick Sell
        </Button>
      ) : (
        <Button
          className="primary w-full justify-center"
          onClick={() => handleSellAuto()}
        >
          Create Order
        </Button>
      )}
    </div>
  );
}
