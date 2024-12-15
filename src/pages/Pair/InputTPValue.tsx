import {
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Tooltip from "../../components/common/Tooltip";
import Dropdown, { DropdownItem } from "../../components/common/Dropdown";
import { formatNumber } from "../../components/common/FormattedNumber";

const TYPES = ["Price ↑ by", "Price is"];

interface InputValueProps {
  type: number; // 0: MC ↓ by 1: MC is 2: By target line
  price: number | undefined;
  value: string;
  setType: (value: number) => void;
  setValue: (value: string) => void;
  highlight?: boolean;
}

export default function InputTPValue({
  type,
  price,
  setType,
  value,
  setValue,
  highlight = true,
}: InputValueProps) {
  const getPrice = () => {
    if (!price) return Number(value);

    if (type === 0) {
      return price + (price * Number(value)) / 100;
    } else {
      return Number(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex border border-outline rounded-lg text-sm">
        <div className={`w-[140px] flex`}>
          <Dropdown
            className="w-full"
            position="left"
            DropdownButton={(toggle: any) => (
              <div
                className="flex justify-between items-center p-2 relative cursor-pointer"
                onClick={toggle}
              >
                <span>{TYPES[type]}</span>
                <ChevronDownIcon className="size-4" />
              </div>
            )}
            DropdownMenu={
              <div className="flex w-[160px] flex-col gap-2 font-normal normal-case">
                {TYPES.map((value, index) => (
                  <DropdownItem
                    key={value}
                    className="flex items-center justify-start gap-1 text-start text-sm"
                    onClick={() => {
                      setType(index);
                    }}
                  >
                    {value}
                  </DropdownItem>
                ))}
              </div>
            }
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-l border-outline">
          <span className="text-gray text-center">{"≥"}</span>
          <input
            className="flex-grow bg-transparent outline-none w-full"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
          />
          <span className="text-gray text-center">
            {type === 0 || type === 2 ? "%" : "$"}
          </span>
        </div>
      </div>
      {value && highlight ? (
        <div className="flex">
          <Tooltip
            position="right"
            content={
              <div className="text-left w-[320px]">
                For limit orders, they are executed according to the target
                price. The market cap displayed is for your reference only and
                is not used in order execution.
                <br />
                When setting a limit order, please make sure that the target
                price shown is accurate and that the price you want the order to
                trigger at is correct before pressing the Create Order button.
              </div>
            }
          >
            <InformationCircleIcon className="size-3 text-gray" />
          </Tooltip>
          <span className="text-sm text-gray">{`Triggers on: Price ≥ $${formatNumber(
            getPrice(),
            4
          )}`}</span>
        </div>
      ) : null}
    </div>
  );
}
