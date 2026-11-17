import React, { useLayoutEffect, useRef } from "react";
import ImageComparison from "./ComparisonBest";
import NavBar from "../NavBar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  return (
    <div id="hero-root" className="pb-16 md:pb-20">
      <div className="grid">
        <ImageComparison />
      </div>
    </div>
  );
};

export default Hero;
