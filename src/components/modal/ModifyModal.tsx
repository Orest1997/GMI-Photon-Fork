import React, { useEffect, useState } from "react";
import Modal from ".";
import CheckBox from "../common/CheckBox";
import Input from "../common/Input";
import ReactSlider from "react-slider";
import InputSLValue from "../../pages/Pair/InputSLValue";
import InputTPValue from "../../pages/Pair/InputTPValue";
import {
  ILimitOrder,
  ILimitOrderProtobuf,
  IPoolOverview,
} from "../../interface";
import { Button } from "@headlessui/react";
import { updateLimitOrder } from "../../libs/fetches";
import { toast } from "react-toastify";

interface ModifyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedOrder: ILimitOrder | undefined;
  poolInfo: IPoolOverview | undefined;
  orderRefretch: () => void;
}

const ModifyModal: React.FC<ModifyModalProps> = ({
  open,
  setOpen,
  selectedOrder,
  poolInfo,
  orderRefretch,
}) => {
  const [type, setType] = useState(1);
  const [value, setValue] = useState("");

  const [typeTP, setTypeTP] = useState(1);
  const [orderTPId, setOrderTPId] = useState<string | undefined>();
  const [valueTP, setValueTP] = useState("");

  const [typeSL, setTypeSL] = useState(1);
  const [orderSLId, setOrderSLId] = useState<string | undefined>();
  const [valueSL, setValueSL] = useState("");

  const handleUpdate = async () => {
    if (!poolInfo || !selectedOrder) return;

    let target_value = Number(value);
    if (type % 2 === 0) {
      target_value = (poolInfo.price * (100 - target_value)) / 100;
    }
    const trigger_type = 0; // type < 2 ? 1 : 0; // 1: marketcap, 0: price

    let order: ILimitOrderProtobuf = {
      buyDip: {
        id: selectedOrder._id,
        target_value: target_value,
        amount: selectedOrder.amount,
        trigger_type: trigger_type,
      },
    };
    if (valueTP && !isNaN(Number(valueTP))) {
      let target_value = Number(valueTP);
      if (typeTP % 2 === 0) {
        target_value = (poolInfo.price * (100 + target_value)) / 100;
      }
      order.sellDipTP = {
        id: orderTPId,
        target_value: target_value,
        amount: Number(100),
        trigger_type: trigger_type,
        amount_type: 1,
      };
    }
    if (valueSL && !isNaN(Number(valueSL))) {
      let target_value = Number(valueSL);
      if (typeSL % 2 === 0) {
        target_value = (poolInfo.price * (100 - target_value)) / 100;
      }
      order.sellDipSL = {
        id: orderSLId,
        target_value: target_value,
        amount: Number(100),
        trigger_type: trigger_type,
        amount_type: 1,
      };
    }

    const ret = await updateLimitOrder(
      poolInfo.poolAddress,
      poolInfo.baseMint,
      selectedOrder.expire,
      selectedOrder.trxPriority,
      selectedOrder.slippage,
      poolInfo.price,
      order
    );
    if (ret) {
      toast.success("Order created successfully!");
      orderRefretch();
      setOpen(false);
    } else {
      toast.error("Order create failed!");
    }
  };

  useEffect(() => {
    setValue(selectedOrder?.target_price.toFixed(4) || "");
    selectedOrder?.sellOrders?.map((order: ILimitOrder) => {
      if (order.type === 0) {
        setValueTP(order.target_price.toFixed(4) || "");
        setOrderTPId(order._id);
      } else if (order.type === 1) {
        setValueSL(order.target_price.toFixed(4) || "");
        setOrderSLId(order._id);
      }
    });
  }, [, selectedOrder]);

  if (!selectedOrder || !poolInfo) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      closeModal={() => {
        setOpen(false);
      }}
      title="Update Order"
    >
      <hr className="my-3 text-light-gray" />
      <div className="grid grid-cols-1 gap-4 my-2 mt-6 rounded-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-gray text-xs">Price</span>{" "}
              <InputSLValue
                type={type}
                price={poolInfo.price}
                setType={setType}
                value={value}
                setValue={setValue}
                highlight={false}
              />
              {type === 0 ? (
                <div className="flex flex-col mt-2 gap-2">
                  <ReactSlider
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
                price={poolInfo.price}
                setType={setTypeTP}
                value={valueTP}
                setValue={setValueTP}
                highlight={false}
              />
              {typeTP === 0 ? (
                <div className="flex flex-col mt-2 gap-2">
                  <ReactSlider
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
                price={poolInfo.price}
                setType={setTypeSL}
                value={valueSL}
                setValue={setValueSL}
                highlight={false}
              />
              {typeSL === 0 ? (
                <div className="flex flex-col mt-2 gap-2">
                  <ReactSlider
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
          </div>
        </div>

        <Button
          className="primary w-full justify-center"
          onClick={handleUpdate}
        >
          Update Order
        </Button>
      </div>
    </Modal>
  );
};

export default ModifyModal;
