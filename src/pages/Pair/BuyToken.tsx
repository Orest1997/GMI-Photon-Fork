import { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import { Button } from "@headlessui/react";
import AdvancedSetting from "./AdvancedSetting";
import {
  ILimitOrder,
  ILimitOrderProtobuf,
  IPoolOverview,
} from "../../interface";
import { useAccountInfo } from "../../providers/AppContext";
import millify from "millify";
import { addLimitOrder, fetchPoolInfo, swapToken } from "../../libs/fetches";
import { DEFAULT_TOKEN } from "../../helpers/config";
import RadioButtons from "../../components/buttons/RadioButtons";
import BuyDip from "./BuyDip";
import { useTokenData } from "../../providers/TokenData";
import { toast } from "react-toastify";
import { formatNumber } from "../../libs/utils";

type Props = {
  poolInfo?: IPoolOverview;
  addBuyDipLine: (order: ILimitOrder) => void;
};

const SELL_OPTIONS = [
  {
    value: "now",
    label: "Buy Now",
  },
  {
    value: "dip",
    label: "Buy Dip",
  },
];

export default function BuyToken(props: Props) {
  const { useUserInfo, slippage, priority } = useAccountInfo();
  const { data: userInfo, refetch } = useUserInfo();

  const [amount, setAmount] = useState<string>("");
  const [option, setOption] = useState<string>("now");

  const [type, setType] = useState(0);
  const [value, setValue] = useState("20.0");

  const [typeTP, setTypeTP] = useState(0);
  const [enableTP, setEnableTP] = useState(false);
  const [valueTP, setValueTP] = useState("20.0");

  const [typeSL, setTypeSL] = useState(0);
  const [enableSL, setEnableSL] = useState(false);
  const [valueSL, setValueSL] = useState("20.0");

  const [expire, setExpire] = useState("24");

  const handleBuyNow = async () => {
    if (props.poolInfo && !isNaN(Number(amount))) {
      toast.success("Sending Transaction...");
      const ret = await swapToken(
        props.poolInfo.poolAddress,
        DEFAULT_TOKEN,
        props.poolInfo.baseMint,
        Number(amount),
        slippage,
        priority
      );
      if (ret) {
        toast.success("Transaction has been confirmed successfully");
        refetch();
      } else {
        toast.error("Transaction has been failed");
      }
    }
  };

  const handleBuyDip = async () => {
    if (
      props.poolInfo &&
      !isNaN(Number(value)) &&
      !isNaN(Number(amount)) &&
      !isNaN(Number(expire))
    ) {
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
        target_value = (props.poolInfo?.price * (100 - target_value)) / 100;
        /* type === 0
              ? (poolInfo.mcap * (100 - target_value)) / 100
              : (poolInfo.price * (100 - target_value)) / 100; */
      }
      const trigger_type = 0; // type < 2 ? 1 : 0; // 1: marketcap, 0: price

      let order: ILimitOrderProtobuf = {
        buyDip: {
          target_value: target_value,
          amount: Number(amount),
          trigger_type: trigger_type,
        },
      };
      if (enableTP && !isNaN(Number(valueTP))) {
        let tp_value = Number(valueTP);
        if (typeTP % 2 === 0) {
          tp_value = (target_value * (100 + tp_value)) / 100;
        }
        order.sellDipTP = {
          target_value: tp_value,
          amount: Number(100),
          trigger_type: trigger_type,
          amount_type: 1,
        };
      }
      if (enableSL && !isNaN(Number(valueSL))) {
        let sl_value = Number(valueSL);
        if (typeSL % 2 === 0) {
          sl_value = (target_value * (100 - sl_value)) / 100;
        }
        order.sellDipSL = {
          target_value: sl_value,
          amount: Number(100),
          trigger_type: trigger_type,
          amount_type: 1,
        };
      }
      const ret = await addLimitOrder(
        props.poolInfo?.poolAddress,
        props.poolInfo?.baseMint,
        Number(expire),
        priority,
        slippage,
        props.poolInfo?.price,
        order
      );
      if (ret) {
        toast.success("Order created successfully!");
        props.addBuyDipLine(ret);
      } else {
        toast.error("Order create failed!");
      }
    }
  };

  useEffect(() => {
    if (type === 0) {
      setValue("20.0");
    } else {
      if (Number(value)) {
        setValue(
          millify(
            ((props.poolInfo?.price || 0) * (100 - Number(value))) / 100,
            { precision: 4 }
          )
        );
      } else {
        setValue(millify(Number(props.poolInfo?.price), { precision: 4 }));
      }
    }
  }, [type]);

  useEffect(() => {
    if (typeTP === 0) {
      setValueTP("20.0");
    } else {
      if (Number(valueTP)) {
        setValueTP(
          millify(((Number(value) || 0) * (100 + Number(valueTP))) / 100, {
            precision: 4,
          })
        );
      } else {
        setValueTP(millify(Number(props.poolInfo?.price), { precision: 4 }));
      }
    }
  }, [typeTP]);

  useEffect(() => {
    if (typeSL === 0) {
      setValueSL("20.0");
    } else {
      if (Number(valueTP)) {
        setValueSL(
          millify(((Number(value) || 0) * (100 - Number(valueTP))) / 100, {
            precision: 4,
          })
        );
      } else {
        setValueSL(millify(Number(props.poolInfo?.price), { precision: 4 }));
      }
    }
  }, [typeSL]);

  return (
    <div className={`flex flex-col py-4 gap-4 font-semibold`}>
      <RadioButtons
        className="grid grid-cols-2"
        options={SELL_OPTIONS}
        onChange={setOption}
        defaultValue={option}
      />

      <div className="flex flex-col gap-5">
        <Input
          label="Balance"
          highlight={`${millify(userInfo ? userInfo.sol_balance : 0, {
            precision: 4,
          })} SOL`}
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          onHighlight={() =>
            setAmount((userInfo ? userInfo.sol_balance : 0).toString())
          }
        >
          <span className="text-sm">SOL</span>
        </Input>

        {option === "dip" ? (
          <BuyDip
            type={type}
            typeTP={typeTP}
            typeSL={typeSL}
            valueTP={valueTP}
            valueSL={valueSL}
            enableTP={enableTP}
            enableSL={enableSL}
            price={props.poolInfo?.price}
            expire={expire}
            value={value}
            setType={setType}
            setTypeTP={setTypeTP}
            setTypeSL={setTypeSL}
            setValueTP={setValueTP}
            setValueSL={setValueSL}
            setEnableTP={setEnableTP}
            setEnableSL={setEnableSL}
            setExpire={setExpire}
            setValue={setValue}
          />
        ) : null}
      </div>

      <AdvancedSetting />

      {option === "now" ? (
        <Button
          className="primary w-full justify-center"
          onClick={() => handleBuyNow()}
        >
          {" "}
          Quick Buy{" "}
        </Button>
      ) : (
        <Button
          className="primary w-full justify-center"
          onClick={() => handleBuyDip()}
        >
          {" "}
          Create Order{" "}
        </Button>
      )}
    </div>
  );
}
