import React from "react";

interface SubTitleProps {
  title: string;
  content: string;
}

export const SubTitle: React.FC<SubTitleProps> = ({ title, content }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="gradient_text text-[55px] font-normal text-center uppercase">
        {title}
      </span>
      <span className="max-w-[800px] text-[18px] font-normal opacity-55 text-center">
        {content}
      </span>
    </div>
  );
};
