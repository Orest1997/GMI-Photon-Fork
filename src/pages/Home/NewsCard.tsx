import React from "react";

interface NewsCardProps {
  title: string;
  image: string;
  content: string;
}

export const NewsCard: React.FC<NewsCardProps> = (props) => {
  return (
    <div className="person_card w-[400px] rounded-3xl p-[28px] flex flex-col gap-[30px]">
      <img src={props.image} className="w-full rounded-2xl"></img>
      <span className="text-[28px] font-normal">{props.title}</span>
      <span className="text-[14px] font-normal">{props.content}</span>
    </div>
  );
};
