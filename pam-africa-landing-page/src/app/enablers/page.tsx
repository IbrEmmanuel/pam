import TheEnablers from "@/components/enablers/TheEnablers";
import HeroTitleText from "@/components/HeroTitleText";
import NavBar from "@/components/NavBar";
import React from "react";

const Enablers = () => {
  return (
    <div>
      <NavBar />
      <HeroTitleText
        title="Enablers"
        text="We serve as a strategic partner to energy developers, utilities, governments, and innovators — offering a modular suite of support services that cover every phase of the project lifecycle. From engineering design and procurement to legal compliance, investor readiness, workforce development, and performance analytics, PAM."
      />
      <TheEnablers />
    </div>
  );
};

export default Enablers;
