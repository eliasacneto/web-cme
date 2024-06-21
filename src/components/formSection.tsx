import GreenButton from "./greenButton";
import StepForm from "./stepForm";

const FormSection = () => {
  return (
    <div
      className="flex flex-col lg:flex-row  items-center lg:items-start lg:justify-around lg:gap-0 lg:px-40 lg:py-1
     gap-5 bg-neutral-100 py-5 "
    >
      <div className="flex flex-col items-start lg:w-[60%] px-10 mt-20 ">
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
        <p className="mt-4 text-lg lg:text-2xl antialiased font-bold  lg:min-w-[80%] lg:w-[60%] text-left">
          Garanta para o seu hospital
        </p>
        <ul className="mt-4 text-base lg:text-lg antialiased  lg:min-w-[80%] lg:w-[60%] text-justify flex flex-col gap-2 list-disc">
          <li>
            <strong>Segurança impecável:</strong> Proteja pacientes e equipe com
            equipamentos sempre em perfeito estado.
          </li>
          <li>
            <strong>Qualidade inigualável:</strong> Ofereça o melhor atendimento
            com tecnologia de ponta e manutenção preventiva.
          </li>
          <li>
            <strong>Economia inteligente:</strong> Otimize seus recursos e
            reduza custos com um plano de gestão eficiente.
          </li>
        </ul>
        <p className="mt-4 text-base lg:text-lg antialiased  lg:min-w-[80%] lg:w-[60%] text-justify">
          Preencha nosso formulário rápido e personalizado e receba uma lista
          com os produtos ideais para suas necessidades.
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
      <div className="flex items-center justify-center w-[90%] lg:w-[50%]">
        <StepForm />
      </div>
    </div>
  );
};

export default FormSection;
