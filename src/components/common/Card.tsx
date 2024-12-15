import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={`flex bg-[#110a22] border border-[#01f9e6] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
