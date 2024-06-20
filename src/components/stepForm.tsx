import { faArrowLeft, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";

const STEPS_AMOUNT = 4;

interface FinishSectionButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  children: React.ReactNode;
}

const FinishSectionButton: React.FC<FinishSectionButtonProps> = ({
  onClick,
  isDisabled,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      type="button"
      className="mt-6 bg-[#a7b928] text-white py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

interface FormValues {
  username: string;
  hospitalName: string;
  hospitalEmail: string;
  hospitalContact: string;
  cnpj: string;
  role: string;
  address: string;
  cep: string;
  number: string;
  street: string;
  neighborhood: string;
  toc: boolean;
  pp: boolean;
}

const StepForm: React.FC = () => {
  const [formStep, setFormStep] = React.useState<number>(0);

  const [hasClinicalEngineering, setHasClinicalEngineering] =
    useState<string>("option-two");

  const handleFirstChange = (value: string) => {
    setHasClinicalEngineering(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const handleStepCompletion = () => {
    setFormStep((cur) => cur + 1);
  };

  const handleGoBackToPreviousStep = () => {
    setFormStep((cur) => cur - 1);
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log(JSON.stringify(values, null, 2));
    handleStepCompletion();
  };

  return (
    <div className="mx-8 max-w-xl w-full mt-24 mb-24 rounded-lg shadow-2xl bg-white overflow-hidden z-10">
      <div className="h-2 bg-gray-200 w-full overflow-hidden">
        <div
          style={{ width: `${(formStep / STEPS_AMOUNT) * 100}%` }}
          className="h-full bg-[#A4BA25] transform duration-300 ease-out"
        ></div>
      </div>
      <div className="px-10 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          {formStep < STEPS_AMOUNT && (
            <div className="flex items-center font-medium mb-8">
              {formStep > 0 && (
                <button
                  onClick={handleGoBackToPreviousStep}
                  type="button"
                  className="focus:outline-none hover:text-xl transform duration-300 ease-out"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    size="lg"
                    className="text-[#a7b928] "
                  />
                </button>
              )}{" "}
              <h3 className="ml-2">
                Passo {formStep + 1} de {STEPS_AMOUNT}
              </h3>
            </div>
          )}
          {formStep >= 0 && (
            <section className={`${formStep === 0 ? "block" : "hidden"}`}>
              <h2 className="font-semibold text-3xl mb-8">
                Preencha as informações
              </h2>
              <div className="flex flex-col">
                <Label htmlFor="username" className="text-base mb-2">
                  Nome completo:
                </Label>
                <Input
                  id="username"
                  {...register("username", {
                    required: { message: "Preencha este campo", value: true },
                    minLength: {
                      message: "Informe o seu Nome e sobrenome",
                      value: 3,
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="hospitalEmail" className="text-base mb-2">
                    E-mail do hospital:
                  </Label>
                  <Input
                    id="hospitalEmail"
                    type="email"
                    {...register("hospitalEmail", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Preencha com um e-mail válido!",
                        value: 3,
                      },
                    })}
                  />

                  {errors.hospitalEmail && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.hospitalEmail.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="hospitalContact" className="text-base mb-2">
                    Contato:
                  </Label>
                  <Input
                    id="hospitalContact"
                    {...register("hospitalContact", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe um número válido!",
                        value: 10,
                      },
                    })}
                  />

                  {errors.hospitalContact && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.hospitalContact.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <Label htmlFor="hospitalName" className="text-base mb-2">
                  Nome do hospital:
                </Label>
                <Input
                  id="hospitalName"
                  {...register("hospitalName", {
                    required: { message: "Preencha este campo", value: true },
                    minLength: {
                      message: "Preencha com o nome do hospital",
                      value: 3,
                    },
                  })}
                />
                {errors.hospitalName && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.hospitalName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="username" className="text-base mb-2">
                    CNPJ:
                  </Label>
                  <Input
                    id="cnpj"
                    {...register("cnpj", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe um documento válido",
                        value: 14,
                      },
                    })}
                  />

                  {errors.cnpj && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.cnpj.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="role" className="text-base mb-2">
                    Seu cargo atual:
                  </Label>
                  <Input
                    id="role"
                    {...register("role", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: { message: "Informe um cargo", value: 3 },
                    })}
                  />

                  {errors.role && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="cep" className="text-base mb-2">
                    CEP:
                  </Label>
                  <Input
                    id="cep"
                    {...register("cep", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: { message: "Informe um cep válido", value: 8 },
                    })}
                  />

                  {errors.cep && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.cep.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="number" className="text-base mb-2">
                    Número:
                  </Label>
                  <Input
                    id="number"
                    {...register("number", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe um número válido",
                        value: 1,
                      },
                    })}
                  />

                  {errors.number && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.number.message}
                    </p>
                  )}
                </div>
              </div>{" "}
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="street" className="text-base mb-2">
                    Avenida/Rua:
                  </Label>
                  <Input
                    id="street"
                    {...register("street", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe a rua ou avenida",
                        value: 3,
                      },
                    })}
                  />

                  {errors.street && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.street.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="neighborhood" className="text-base mb-2">
                    Bairro:
                  </Label>
                  <Input
                    id="neighborhood"
                    {...register("neighborhood", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe o nome do Bairro",
                        value: 3,
                      },
                    })}
                  />

                  {errors.neighborhood && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.neighborhood.message}
                    </p>
                  )}
                </div>
              </div>
              {/* <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4">
                  <Label htmlFor="username">Segmento da empresa:</Label>
                  <Select>
                    <SelectTrigger className="w-[250px] mt-4">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Segmento A</SelectItem>
                      <SelectItem value="b">Segmento B</SelectItem>
                      <SelectItem value="c">Segmento C</SelectItem>
                    </SelectContent>
                  </Select>

                  {errors.username && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4">
                  <Label htmlFor="username">Cargo:</Label>
                  <Select>
                    <SelectTrigger className="w-[250px] mt-4">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Cargo A</SelectItem>
                      <SelectItem value="b">Cargo B</SelectItem>
                      <SelectItem value="c">Cargo C</SelectItem>
                    </SelectContent>
                  </Select>

                  {errors.username && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div> */}
              <FinishSectionButton
                onClick={handleStepCompletion}
                isDisabled={!isValid}
              >
                Próximo
              </FinishSectionButton>
            </section>
          )}
          {formStep >= 1 && (
            <section className={`${formStep === 1 ? "block" : "hidden"}`}>
              <h2 className="font-semibold text-3xl mb-8">Momento atual...</h2>
              <div className="flex flex-col mt-4">
                <Label htmlFor="username" className="text-base mb-2">
                  Qual o momento atual do empreendimento?
                </Label>
                <Select>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Elaboração projetos">
                      Elaboração projetos
                    </SelectItem>
                    <SelectItem value="Visita técnica para avaliação diagnóstica">
                      Visita técnica para avaliação diagnóstica
                    </SelectItem>
                    <SelectItem value="Dimensionamento e especificação técnica dos equipamentos para aquisição">
                      Dimensionamento e especificação técnica dos equipamentos
                      para aquisição
                    </SelectItem>
                    <SelectItem value="Análise técnica financeira comparativa dos equipamentos">
                      Análise técnica financeira comparativa dos equipamentos
                    </SelectItem>
                    <SelectItem value="Comissionamento das instalações">
                      Comissionamento das instalações
                    </SelectItem>
                    <SelectItem value="Outro momento">Outro momento</SelectItem>
                  </SelectContent>
                </Select>

                {errors.username && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <Label htmlFor="username" className="text-base mb-2">
                  Possui engenharia clínica para apoiar o processo de seleção
                  dos equipamentos?
                </Label>
                <RadioGroup
                  className="flex mt-2"
                  defaultValue={hasClinicalEngineering}
                  onValueChange={handleFirstChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Não</Label>
                  </div>
                </RadioGroup>
              </div>
              {hasClinicalEngineering === "option-one" && (
                <div className="flex flex-col mt-4">
                  <Label htmlFor="username" className="text-base mb-2">
                    A sua Engenharia Clínica é própria ou terceirizada?
                  </Label>
                  <RadioGroup defaultValue="option-three" className="flex mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-two" />
                      <Label htmlFor="option-three">Não se aplica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Não</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <div className="flex flex-col mt-4">
                <Label htmlFor="username" className="text-base mb-2">
                  Do que sente mais falta no suporte da engenharia clinica?
                </Label>
                <Textarea
                  placeholder="Escreva aqui..."
                  id="address"
                  {...register("address", {})}
                />
                {/* {errors.address && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.address.message}
                  </p>
                )} */}
              </div>
              {/* 
              <div className="flex flex-col mt-4">
                <Label htmlFor="username" className="text-base">
                  Qual o intervalo de pico de funcionamento da CME em horas?
                  <br />{" "}
                  <span className="text-sm text-red-500">
                    (período de processamento de 90% do material)
                  </span>
                </Label>
                <Input
                  id="address"
                  placeholder="Ex.: 12"
                  {...register("address", {
                    required: { message: "Preencha este campo", value: true },
                  })}
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.address.message}
                  </p>
                )}
              </div> */}

              <FinishSectionButton
                onClick={handleStepCompletion}
                isDisabled={!isValid}
              >
                Próximo
              </FinishSectionButton>
            </section>
          )}
          {formStep >= 2 && (
            <section className={`${formStep === 2 ? "block" : "hidden"}`}>
              <h2 className="font-semibold text-3xl mb-8">Para finalizar</h2>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="hospitalEmail" className="text-base mb-2">
                    Nº de salas cirúrgicas
                  </Label>
                  <Input
                    id="hospitalEmail"
                    type="email"
                    {...register("hospitalEmail", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Preencha com um e-mail válido!",
                        value: 3,
                      },
                    })}
                  />

                  {errors.hospitalEmail && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.hospitalEmail.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="hospitalContact" className="text-base mb-2">
                    Nº de cirurgias/sala/dia
                  </Label>
                  <Input
                    id="hospitalContact"
                    {...register("hospitalContact", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe um número válido!",
                        value: 10,
                      },
                    })}
                  />

                  {errors.hospitalContact && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.hospitalContact.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="block mt-6">
                <input
                  {...register("toc", {
                    required: true,
                  })}
                  name="toc"
                  className="p-3 text-[#a7b928] rounded mr-3 border-2 border-gray-300 ring-0 focus:ring-0 focus:ring-offset-0 focus:border-0 cursor-pointer"
                  type="checkbox"
                />
                <span>
                  Estou ciente que posso gerar esse relatório apenas uma vez.
                </span>
              </div>
              <div className="block mt-6">
                <input
                  {...register("pp", {
                    required: true,
                  })}
                  name="pp"
                  className="p-3 text-[#a7b928]  rounded mr-3 border-2 border-gray-300 ring-0 focus:ring-0 focus:ring-offset-0 focus:border-0 cursor-pointer"
                  type="checkbox"
                />
                <span>Autorizo a Equipacare entrar em contato comigo.</span>
              </div>
              <button
                disabled={!isValid}
                type="submit"
                className="mt-6 bg-[#a7b928] text-white py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Gerar cálculo baseado nas informações
              </button>
            </section>
          )}
          {formStep === 4 && (
            <section>
              <h2 className="font-semibold text-3xl mb-8">
                Confira o resultado!
              </h2>
              <p>Informações geradas baseada nos cálculos...</p>
              <button
                type="submit"
                className="mt-6 bg-[#a7b928] text-white py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 "
              >
                <FontAwesomeIcon icon={faChartPie} className="mr-2" size="lg" />
                Solicitar um relatório detalhado
              </button>
            </section>
          )}

          {formStep >= 3 && (
            <section className={`${formStep === 2 ? "block" : "hidden"}`}>
              <h2 className="font-semibold text-3xl mb-8">
                Estamos quase lá...
              </h2>
              <div className="block mt-6">
                <input
                  {...register("toc", {
                    required: true,
                  })}
                  name="toc"
                  className="p-3 text-[#a7b928] rounded mr-3 border-2 border-gray-300 ring-0 focus:ring-0 focus:ring-offset-0 focus:border-0 cursor-pointer"
                  type="checkbox"
                />
                <span>
                  Estou ciente que posso gerar esse relatório apenas uma vez.
                </span>
              </div>
              <div className="block mt-6">
                <input
                  {...register("pp", {
                    required: true,
                  })}
                  name="pp"
                  className="p-3 text-[#a7b928]  rounded mr-3 border-2 border-gray-300 ring-0 focus:ring-0 focus:ring-offset-0 focus:border-0 cursor-pointer"
                  type="checkbox"
                />
                <span>Autorizo a Equipacare entrar em contato comigo.</span>
              </div>
              <button
                disabled={!isValid}
                type="submit"
                className="mt-6 bg-[#a7b928] text-white py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Gerar cálculo baseado nas informações
              </button>
            </section>
          )}
          {formStep === 4 && (
            <section>
              <h2 className="font-semibold text-3xl mb-8">
                Confira o resultado!
              </h2>
              <p>Informações geradas baseada nos cálculos...</p>
              <button
                type="submit"
                className="mt-6 bg-[#a7b928] text-white py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 "
              >
                <FontAwesomeIcon icon={faChartPie} className="mr-2" size="lg" />
                Solicitar um relatório detalhado
              </button>
            </section>
          )}
          {/* <p>{isValid ? "Valid" : "Invalid"}</p>
          <pre className="text-sm text-gray-700">
            {JSON.stringify(watch(), null, 2)}
          </pre> */}
        </form>
      </div>
    </div>
  );
};

export default StepForm;
