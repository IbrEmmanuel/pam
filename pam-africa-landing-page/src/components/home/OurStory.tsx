import Image from "next/image";
import React from "react";

const OurStory = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 min-h-screen py-10 my-[79px]">
      <div>
        <Image
          src="/images/pam_office.png"
          width={2000}
          height={2000}
          className="h-full"
          alt="pam office"
        />
      </div>
      <div className="flex px-3 md:px-10 mt-[150px] flex-col md:flex-row ">
        <p className="basis-1/4 text-[28px] font-semibold mb-5 md:mb-0">
          Our Story
        </p>
        <div className="basis-3/4 space-y-3 leading-tight md:text-left text-justify">
          <p>
            PAM was born from a personal journey — inspired by our founder’s
            childhood experiences of growing up without reliable electricity.
            Established in 2021, we set out with a single purpose: to transform
            lives across Africa through access to clean, reliable, and quality
            energy. What began as a vision rooted in lived experience has grown
            into one of Africa’s leading energy enabler ecosystems.
          </p>
          <p>
            Since our inception, we have pioneered award-winning products and
            services, delivering innovative solutions that reach communities in
            Nigeria, extend to projects in Burkina Faso and Senegal, and serve
            clients across the globe. Each milestone reflects our unwavering
            belief that access to energy is not just a utility, but a foundation
            for dignity, opportunity, and progress.
          </p>
          <p>
            Our strength lies in our people. We are a multidisciplinary team of
            engineers, designers, consultants, technologists, and specialists
            across communications, administration, HR, and finance — united by a
            shared passion for impact. By collaborating with experts across
            diverse fields, we ensure that every project, from initial concept
            to completion, is delivered with technical excellence, innovation,
            and a deep sense of responsibility to the communities we serve.
          </p>
          <p>
            At PAM, our story is more than energy. It is about resilience,
            possibility, and the belief that no child, community, or nation
            should be limited by lack of electricity. Together, we are building
            a brighter, more sustainable future for Africa and beyond."
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
