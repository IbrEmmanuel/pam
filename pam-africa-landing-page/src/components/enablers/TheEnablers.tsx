import React from "react";
import { EnablerItem, EnablersData } from "@/constants/enablers";
import ImageText from "../ImageText";

const TheEnablers = () => {
  const data: EnablerItem[] = EnablersData;

  return (
    <div>
      {data.map((enabler, index) => (
        <ImageText
          key={enabler.title}
          image={enabler.image}
          video={enabler.video}
          title={enabler.title}
          t1={enabler.text1}
          t2={enabler.text2}
          t3={enabler.text3}
          order1={`${index % 2 !== 0 && "md:order-2"}`}
          special={enabler.title}
        />
      ))}
    </div>
  );
};

export default TheEnablers;
