import React from "react";

interface NavItemProps {
  logo: string;
  title?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  logo,
  title,
  selected = false,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center gap-[16px] px-6 py-2 rounded-full cursor-pointer ${
        selected
          ? "border border-[#01F9E6] bg-[#D9D9D91A]"
          : "bg-transparent hover:bg-[#D9D9D91A]"
      }`}
      onClick={onClick}
    >
      <img src={logo} className="w-[24px] h-[24px]"></img>
      {title && (
        <span
          className={`uppercase ${
            selected ? "text-[#00F3E7] font-bold" : "text-white"
          }`}
        >
          {title}
        </span>
      )}
    </div>
  );
};
