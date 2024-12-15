import React from "react";

interface PersonCardProps {
  name: string;
  avatar: string;
  follows: number;
  focus: string[];
}

export const PersonCard: React.FC<PersonCardProps> = (props) => {
  return (
    <div className="person_card w-[400px] rounded-3xl p-[28px] flex flex-col gap-[30px]">
      <img src={props.avatar} className="w-full rounded-2xl"></img>
      <div className="flex justify-between items-center">
        <span className="text-[40px] font-normal">{props.name}</span>
        <div className="border border-[#00F3E7] rounded-full p-2 px-3 flex gap-2 items-center justify-center">
          <img src="assets/icons/followers.svg"></img>
          <span className="text-[16px]">{props.follows}M</span>
        </div>
      </div>
      <div className="flex items-start flex-grow">
        <div className="flex flex-col items-start gap-2 flex-grow ">
          {props.focus.map((item) => {
            return (
              <span className="uppercase px-2 py-1 text-[10px] font-normal bg-[#00F3E759] rounded-full">
                {item}
              </span>
            );
          })}
        </div>
        <button className="text-[14px] self-end bg-[linear-gradient(136.62deg,_#01F9E6_13.75%,_#00EDE9_29.34%,_#00CEF2_47.47%,_#00A2FF_70.67%,_#0D99FF_86.26%)] backdrop-blur-[50px] rounded-lg px-4 py-2">
          Follow On X
        </button>
      </div>
    </div>
  );
};
