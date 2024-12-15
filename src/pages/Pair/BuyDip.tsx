import Input from "../../components/common/Input";
import InputSLValue from "./InputSLValue";
import CheckBox from "../../components/common/CheckBox";
import InputTPValue from "./InputTPValue";

interface BuyDipProps {
  type: number; // 0: MC ↓ by 1: MC is 2: By target line
  typeTP: number; // 0: MC ↑ by 1: MC is 2: By target line
  typeSL: number; // 0: MC ↓ by 1: MC is 2: By target line
  valueTP: string;
  valueSL: string;
  enableTP: boolean;
  enableSL: boolean;
  price: number | undefined;
  value: string;
  expire: string;
  setType: (value: number) => void;
  setTypeTP: (value: number) => void;
  setTypeSL: (value: number) => void;
  setEnableTP: (value: boolean) => void;
  setEnableSL: (value: boolean) => void;
  setValueTP: (value: string) => void;
  setValueSL: (value: string) => void;
  setValue: (value: string) => void;
  setExpire: (value: string) => void;
}

const BuyDip = ({
  type,
  typeTP,
  typeSL,
  valueTP,
  valueSL,
  enableTP,
  enableSL,
  price,
  setType,
  setTypeTP,
  setTypeSL,
  setValueTP,
  setValueSL,
  setEnableTP,
  setEnableSL,
  value,
  setValue,
  expire,
  setExpire,
}: BuyDipProps) => {
  return (
    <div className="flex flex-col gap-5">
      <InputSLValue
        type={type}
        price={price}
        setType={setType}
        value={value}
        setValue={setValue}
      />

      <div className="flex flex-col gap-2">
        <CheckBox
          initialEnabled={enableTP}
          onChange={(enabled) => setEnableTP(enabled)}
        >
          {" "}
          <span className="text-gray">Take Profit</span>{" "}
        </CheckBox>
        {enableTP && (
          <InputTPValue
            type={typeTP}
            price={price}
            setType={setTypeTP}
            value={valueTP}
            setValue={setValueTP}
            highlight={false}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <CheckBox
          initialEnabled={enableSL}
          onChange={(enabled) => setEnableSL(enabled)}
        >
          {" "}
          <span className="text-gray">Stop Loss</span>{" "}
        </CheckBox>
        {enableSL && (
          <InputSLValue
            type={typeSL}
            price={price}
            setType={setTypeSL}
            value={valueSL}
            setValue={setValueSL}
            highlight={false}
          />
        )}
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
  );
};

export default BuyDip;
