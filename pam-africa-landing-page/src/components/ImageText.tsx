import Image from "next/image";
import React from "react";

const ImageText = ({
  image,
  video,
  order1,
  order2,
  title,
  t1,
  t2,
  t3,
  subtitle,
  btn,
  showBlock,
  className,
  special,
}: {
  image?: string;
  video?: string;
  order1?: string;
  order2?: string;
  title?: string;
  t1?: string;
  t2?: string;
  t3?: string;
  subtitle?: string;
  btn?: string;
  showBlock?: string;
  className?: string;
  special?: string;
}) => {
  return (
    <article className={className}>
      <div className={`grid grid-cols-1 md:grid-cols-2  `}>
        {special && (
          <h1
            className={`font-semibold ${
              special ? "block md:hidden" : ""
            } mt-10 pl-4 mb-4 text-2xl md:text-base`}
          >
            {special}
          </h1>
        )}
        <div className={`h-full mb-5 md:mb-0 ${order1}`}>
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-fit object-cover"
            />
          ) : image ? (
            <Image
              src={image}
              alt="image"
              className="w-full h-fit"
              width={1000}
              priority
              height={1000}
            />
          ) : null}
        </div>
        <div
          className={`grid grid-cols-3 px-4 gap-4  md:pt-20 ${order2} ${showBlock}`}
        >
          <p
            className={`col-span-3 font-semibold ${
              special ? " md:block hidden" : ""
            } md:col-span-1 my-4 text-2xl md:text-base`}
          >
            {title}
          </p>

          <div className="col-span-3 md:col-span-2 flex flex-col gap-5 ">
            {subtitle && <h1 className="font-semibold">{subtitle}</h1>}
            <p className="text-justify md:text-left">{t1}</p>
            <p className="text-justify md:text-left">{t2}</p>
            <p className="text-justify md:text-left">{t3}</p>
            {btn && (
              <a
                href="mailto:support@pamafrica.com"
                className="border-2 px-6 py-3 inline-block"
              >
                {btn}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ImageText;
