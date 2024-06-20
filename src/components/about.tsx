import React from "react";
import GreenButton from "./greenButton";

const About = () => {
  return (
    <>
      <div
        className="flex flex-col-reverse lg:flex-row items-center lg:justify-around lg:gap-0 lg:px-52 lg:py-24
     gap-10 bg-[#161935]  py-10 px-10"
      >
        <div className="flex flex-col w-[60%]">
          <h1 className="text-3xl text-white">
            Otimize o seu{" "}
            <u className="underline-offset-8 decoration-[#A4BA25]">
              planejamento
            </u>
          </h1>
          <p className="mt-8 text-base text-white lg:text-lg antialiased lg:w-[75%] text-justify">
            Com a nossa calculadora, você terá acesso a uma
            <strong> ferramenta poderosa </strong>
            que simplifica o cálculo dos ciclos de esterilização,
            <strong> levando em consideração diversos fatores</strong> como tipo
            de equipamento, carga, temperatura e tempo de exposição.
          </p>
          <p className="mt-5 text-base text-white lg:text-lg antialiased lg:w-[75%] text-justify">
            Além disso,
            <strong> nossa equipe de especialistas está disponível</strong> para
            fornecer suporte e orientação personalizados, garantindo que você
            alcance os <strong>melhores resultados</strong>.
          </p>
          <div className="mt-7">
            <GreenButton text="Quero saber mais" />
          </div>
        </div>
        <div className="flex items-center justify-center w-[40%]">
          <img
            className="rounded-lg w-full object-contain h-96 lg:h-auto"
            src="assets/images/about.jpg"
            alt="about image"
            width={0}
            height={0}
            sizes="100vw"
          />
        </div>
      </div>
    </>
  );
};

export default About;
