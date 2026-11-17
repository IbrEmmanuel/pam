import InsidePAM from "@/components/about/InsidePam";
import MeetTheTeam from "@/components/about/MeetTheTeam";
import WhyWorkWithUs from "@/components/about/WhyWorkWithUs";
import Container from "@/components/Container";
import HeroTitleText from "@/components/HeroTitleText";
import AwardsList from "@/components/home/Awards";
import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <Container>
      <main className="">
        <div className="w-full min-h-[289px]">
          <Image
            src="/about/about-hero.png"
            alt="about hero"
            width={2000}
            height={2000}
            priority
            className="w-full  h-full min-h-[289px]  object-cover"
          />
        </div>

        <InsidePAM />
        <MeetTheTeam />
        <div className="block sm:hidden">
          <AwardsList />
        </div>
        <WhyWorkWithUs />
      </main>
    </Container>
  );
};

export default About;
