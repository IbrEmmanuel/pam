import React from "react";
import WhatWeDo from "./MobileAbout";
import ImageText from "../ImageText";

const WhyWorkWithUs = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-0 ">
      <ImageText
        title="Why work with us"
        image="/about/whyworkwithus1.png"
        t1="  Building a leading energy enabler at the forefront of our industry is about more than delivering innovative solutions; it's about building an exceptional team. At PAM, we cultivate a dynamic environment where people want to work, grow, and contribute to meaningful change. We nurture talent, challenge ideas, and support bold, innovative thinking that shapes the future of energy in Africa."
        t2="Our culture is grounded in collaboration, high performance, and future-focused solutions that empower both our people and the communities we serve. We encourage our teams to test new ideas, embrace emerging technologies, and apply sustainability principles in everything we do."
        t3="We also invest in the next generation of energy leaders through mentorship, training, and capacity-building initiatives, while creating opportunities for connection, creativity, and shared purpose. Above all, we believe in building a workplace that inspires excellence, fosters growth, and drives impact together."
      />
      {/* <WhatWeDo /> */}
      <ImageText
        title="Careers"
        image="/about/whyworkwithus2.png"
        subtitle="Join us!"
        t1=" We're always looking for outstanding talent."
        t2="At PAM, our people are at the heart of everything we do. Over the years,
      our dynamic team has been behind pioneering energy solutions, innovative
      projects, and impactful community initiatives that are transforming access
      to clean, reliable power across Africa."
        t3="We're constantly seeking new thinkers, builders, and innovators to
      strengthen our team of technical, commercial, and creative professionals.
      If you are passionate about renewable energy, technology, and sustainable
      development, your skills align with our mission. We want to hear from you.
      Apply today and be part of the journey to power Africa's future"
        order1="md:order-2"
        btn="Contact us with your application"
      />

      {/* <ImageText
        title="Why work with us"
        className="md:hidden block"
        t1="  Building a leading energy enabler at the forefront of our industry is about more than delivering innovative solutions; it's about building an exceptional team. At PAM, we cultivate a dynamic environment where people want to work, grow, and contribute to meaningful change. We nurture talent, challenge ideas, and support bold, innovative thinking that shapes the future of energy in Africa."
        t2="Our culture is grounded in collaboration, high performance, and future-focused solutions that empower both our people and the communities we serve. We encourage our teams to test new ideas, embrace emerging technologies, and apply sustainability principles in everything we do."
        t3="We also invest in the next generation of energy leaders through mentorship, training, and capacity-building initiatives, while creating opportunities for connection, creativity, and shared purpose. Above all, we believe in building a workplace that inspires excellence, fosters growth, and drives impact together."
      /> */}
    </div>
  );
};

export default WhyWorkWithUs;
