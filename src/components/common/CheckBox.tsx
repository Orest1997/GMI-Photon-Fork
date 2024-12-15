import { Checkbox } from "@headlessui/react";
import { useState, FC } from "react";

type CheckBoxProps = {
  initialEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
  className?: string;
  children?: React.ReactNode;
  readonly?: boolean;
};

const CheckBox: FC<CheckBoxProps> = ({
  initialEnabled = false,
  onChange,
  className,
  children,
  readonly = false,
}) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleSwitchChange = (newState: boolean) => {
    if (readonly) return;

    setEnabled(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <Checkbox
      checked={readonly ? initialEnabled : enabled}
      onChange={handleSwitchChange}
      className={`checkbox font-medium ${className ?? ""} ${
        enabled ? "active" : ""
      }`}
      aria-checked={readonly ? initialEnabled : enabled}
    >
      <span className="checkmark"></span>
      {children}
    </Checkbox>
  );
};

export default CheckBox;
