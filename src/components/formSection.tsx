import GreenButton from "./greenButton";
import StepForm from "./stepForm";

const FormSection = () => {
  return (
    <div
      className="flex flex-col lg:flex-row items-center lg:justify-around lg:gap-0 lg:px-40 lg:py-1
     gap-10 bg-neutral-100 py-10 px-10"
    >
      <div className="flex flex-col lg:w-[60%] ">
        <h1 className="text-3xl font-bold text-black  lg:min-w-[80%] lg:w-[80%]">
          Pronto para otimizar a esterilização de seus {""}
          <u className="underline-offset-8 decoration-[#A4BA25]">
            equipamentos médicos
          </u>
          ?
        </h1>
        <p className="mt-8 text-base lg:text-lg antialiased  lg:min-w-[80%] lg:w-[60%] text-justify">
          <strong>Experimente agora mesmo</strong> a Calculadora CME da
          Equipacare e descubra como podemos <strong>ajudar</strong> sua
          instituição a alcançar os mais <strong>altos padrões</strong> de
          segurança e qualidade.
        </p>
        <div className="mt-7 hidden md:inline-flex">
          <GreenButton
            text="Preencha o formulário ao lado"
            icon="images/arrow-right.svg"
          />
        </div>
        <div className="mt-7 md:hidden">
          <GreenButton
            text="Preencha o formulário ao abaixo"
            icon="images/arrow-right.svg"
          />
        </div>
      </div>
      <div className="flex items-center justify-center lg:w-[60%]">
        <StepForm />
      </div>
    </div>
  );
};

export default FormSection;
