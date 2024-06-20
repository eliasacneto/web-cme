import React from "react";

interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero = (props: HeroProps) => {
  return (
    <>
      <div className="flex flex-col gap-8 justify-center items-center bg-hero bg-cover h-[550px] px-8  ">
        <h1 className="font-bold  text-white text-4xl text-center lg:text-5xl lg:w-[50%] ">
          {props.title}
        </h1>
        <p className="text-white text-center text-lg lg:w-[50%]">
          {props.subtitle}
        </p>
      </div>
    </>
  );
};

export default Hero;
