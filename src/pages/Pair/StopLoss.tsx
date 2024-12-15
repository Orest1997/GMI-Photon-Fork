import Input from "../../components/common/Input";
import millify from "millify";
import Tooltip from "../../components/common/Tooltip";
import {
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Dropdown, { DropdownItem } from "../../components/common/Dropdown";
import InputSLValue from "./InputSLValue";

const TYPES = [
  "MC ↓ by",
  "MC is",
  "Price ↓ by",
  "Price is",
  // 'By target line'
];

interface StopLossProps {
  type: number;
  value: string;
  amount: string;
  expire: string;
  price: number | undefined;
  setType: (value: number) => void;
  setAmount: (value: string) => void;
  setValue: (value: string) => void;
  setExpire: (value: string) => void;
  balance?: number;
  symbol?: string;
}

const StopLoss = ({
  type,
  setType,
  value,
  setValue,
  amount,
  setAmount,
  expire,
  setExpire,
  price,
  balance,
  symbol = "SOL",
}: StopLossProps) => {
  return (
    <div className="flex flex-col gap-5 p-2">
      <InputSLValue
        type={type}
        price={price}
        setType={setType}
        value={value}
        setValue={setValue}
      />

      <hr className="text-light-gray -mx-2" />

      <Input
        label="Balance"
        highlight={`${millify(balance || 0, { precision: 4 })} ${symbol}`}
        value={amount}
        placeholder="Amount"
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        onHighlight={() => setAmount((balance || 0).toString())}
      >
        <span className="text-sm">{symbol}</span>
      </Input>

      <Input
        label="Expires in hrs"
        value={expire}
        type="number"
        onChange={(e) => setExpire(e.target.value)}
      />
    </div>
  );
};

export default StopLoss;
