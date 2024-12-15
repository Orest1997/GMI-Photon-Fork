import React from "react";

interface StepCardProps {
  title: string;
  content: string;
  className?: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  title,
  content,
  className = "",
}) => {
  return (
    <div
      className={`step_card flex flex-col gap-4 p-6 rounded-3xl w-[500px] ${className}`}
    >
      <div className="flex gap-3 items-center">
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12.4246" cy="12.586" r="12.0401" fill="white" />
          <path
            d="M11.9011 9.96875L15.0421 13.1097M15.0421 13.1097L11.9011 16.2506M15.0421 13.1097H8.76026"
            stroke="#434343"
            stroke-width="1.04697"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span className="text-[#FFFFFF] font-semibold">{title}</span>
      </div>
      <span className="text-[#FFFFFFCC]">{content}</span>
    </div>
  );
};
