import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import ReactSlider from "react-slider";
import AdvancedSetting from "./AdvancedSetting";
import {
  ILimitOrder,
  ILimitOrderProtobuf,
  IPoolOverview,
} from "../../interface";
import Input from "../../components/common/Input";
import { useAccountInfo } from "../../providers/AppContext";
import millify from "millify";
import { addLimitOrder } from "../../libs/fetches";
import { toast } from "react-toastify";
import InputSLValue from "./InputSLValue";
import InputTPValue from "./InputTPValue";
import { formatNumber } from "../../libs/utils";

type Props = {
  poolInfo?: IPoolOverview;
  addBuyDipLine: (order: ILimitOrder) => void;
};

export default function TradeToken(props: Props) {
  const { useUserInfo, slippage, priority } = useAccountInfo();
  const { data: userInfo, refetch } = useUserInfo();

  const [amount, setAmount] = useState<string>("");
  const [option, setOption] = useState<string>("now");

  const [type, setType] = useState(0);
  const [value, setValue] = useState("20.0");

  const [typeTP, setTypeTP] = useState(0);
  const [valueTP, setValueTP] = useState("");

  const [typeSL, setTypeSL] = useState(0);
  const [valueSL, setValueSL] = useState("");

  const [expire, setExpire] = useState("24");

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
      if (valueTP && !isNaN(Number(valueTP))) {
        let tp_value = Number(valueTP);
        if (typeTP % 2 === 0) {
          tp_value = (target_value * (100 + target_value)) / 100;
        }
        order.sellDipTP = {
          target_value: tp_value,
          amount: Number(100),
          trigger_type: trigger_type,
          amount_type: 1,
        };
      }
      if (valueSL && !isNaN(Number(valueSL))) {
        let sl_value = Number(valueSL);
        if (typeSL % 2 === 0) {
          sl_value = (target_value * (100 - target_value)) / 100;
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
      setValue(millify(Number(props.poolInfo?.price), { precision: 4 }));
    }
  }, [type]);

  return (
    <div className={`flex flex-col py-4 gap-4 font-semibold`}>
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

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-gray text-xs">Price</span>{" "}
            <InputSLValue
              type={type}
              price={props.poolInfo?.price}
              setType={setType}
              value={value}
              setValue={setValue}
              highlight={false}
            />
            {type === 0 ? (
              <div className="flex flex-col mt-2 gap-2">
                <ReactSlider
                  value={Number(value)}
                  className="horizontal-slider h-1 bg-gray"
                  onChange={(value: number) => {
                    setValue(value.toString());
                  }}
                  renderThumb={(props: any) => (
                    <div {...props}>
                      <div className="size-5 bg-primary rounded-full -mt-2" />
                    </div>
                  )}
                />
                <div className="flex justify-between text-white text-sm">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray text-xs">Take Profit</span>{" "}
            <InputTPValue
              type={typeTP}
              price={props.poolInfo?.price}
              setType={setTypeTP}
              value={valueTP}
              setValue={setValueTP}
              highlight={false}
            />
            {typeTP === 0 ? (
              <div className="flex flex-col mt-2 gap-2">
                <ReactSlider
                  value={Number(valueTP)}
                  className="horizontal-slider h-1 bg-gray"
                  onChange={(value: number) => {
                    setValueTP((value * 2).toString());
                  }}
                  renderThumb={(props: any) => (
                    <div {...props}>
                      <div className="size-5 bg-primary rounded-full -mt-2" />
                    </div>
                  )}
                />
                <div className="flex justify-between text-white text-sm">
                  <span>0</span>
                  <span>200</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray text-xs">Stop Loss</span>{" "}
            <InputSLValue
              type={typeSL}
              price={props.poolInfo?.price}
              setType={setTypeSL}
              value={valueSL}
              setValue={setValueSL}
              highlight={false}
            />
            {typeSL === 0 ? (
              <div className="flex flex-col mt-2 gap-2">
                <ReactSlider
                  value={Number(valueSL)}
                  className="horizontal-slider h-1 bg-gray"
                  onChange={(value: number) => {
                    setValueSL(value.toString());
                  }}
                  renderThumb={(props: any) => (
                    <div {...props}>
                      <div className="size-5 bg-primary rounded-full -mt-2" />
                    </div>
                  )}
                />
                <div className="flex justify-between text-white text-sm">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            ) : null}
          </div>

          <Input
            label="Expires in hrs"
            value={expire}
            type="number"
            min={0}
            max={24}
            onChange={(e) => {
              setExpire(e.target.value);
            }}
          />
        </div>
      </div>

      <AdvancedSetting />

      <Button
        className="primary w-full justify-center"
        onClick={() => handleBuyDip()}
      >
        {" "}
        Create Order{" "}
      </Button>
    </div>
  );
}
