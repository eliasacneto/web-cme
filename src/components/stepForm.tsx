import { faArrowLeft, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";

import InputMask from "react-input-mask";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import axios from "axios";

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
  customer: string;
  hospitalName: string;
  hospitalEmail: string;
  hospitalContact: string;
  cnpj: string;
  role: string;
  cep: string;
  number: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  numberOfSurgery: string;
  numberSurgeryRoomDay: string;
  numberBedUTI: string;
  numberBedIntern: string;
  numberBedRPA: string;
  numberBedObs: string;
  numberBedHospitalDay: string;
  acceptOneReport: string;
  acceptContact: string;
  needing: string;
  intervalCMEHour: string;
  businessMoment: string;
}

const StepForm: React.FC = () => {
  const [formStep, setFormStep] = React.useState<number>(0);
  const [id, setId] = useState(1);

  const [hasClinicalEngineering, setHasClinicalEngineering] =
    useState<string>("option-two");

  const handleFirstChange = (value: string) => {
    setHasClinicalEngineering(value);
  };

  const {
    setValue,

    register,

    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const cepValue = watch("cep");

  useEffect(() => {
    const cleanedCep = cepValue?.replace(/\D/g, "");
    if (cleanedCep?.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cleanedCep}/json/`)
        .then((response) => {
          const { logradouro, bairro, localidade, uf } = response.data;
          setValue("street", logradouro);
          setValue("neighborhood", bairro);
          setValue("city", localidade);
          setValue("state", uf);
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP:", error);
        });
    }
  }, [cepValue, setValue]);

  const handleStepCompletion = () => {
    setFormStep((cur) => cur + 1);
  };

  const handleGoBackToPreviousStep = () => {
    setFormStep((cur) => cur - 1);
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const valuesWithId = { id, ...values };
    console.log(JSON.stringify(values, null, 2));

    try {
      const response = await axios.post(
        "http://localhost:8000/lead",
        valuesWithId
      );
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao enviar os dados para a API", error);
    }
    setId((prevId) => prevId + 1);

    handleStepCompletion();
  };

  interface SelectedDays {
    allDays: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  }
  const [isAllDaysChecked, setIsAllDaysChecked] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({
    allDays: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const handleAllDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAllDaysChecked(checked);
    setSelectedDays({
      allDays: checked,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };

  const handleDayChange =
    (day: keyof SelectedDays) => (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedDays((prev) => ({
        ...prev,
        [day]: e.target.checked,
      }));
    };

  interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
  }

  function Checkbox({ id, checked, onChange, disabled }: CheckboxProps) {
    return (
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
      />
    );
  }

  interface LabelProps {
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
  }

  function Label({ htmlFor, children, className }: LabelProps) {
    return (
      <label htmlFor={htmlFor} className={className}>
        {children}
      </label>
    );
  }

  return (
    <div className=" w-full mt-10 mb-24 rounded-lg shadow-2xl bg-white overflow-hidden mx-3 z-10">
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
                <Label htmlFor="customer" className="text-base mb-2">
                  Nome completo:
                </Label>
                <Input
                  id="customer"
                  {...register("customer", {
                    required: { message: "Preencha este campo", value: true },
                    minLength: {
                      message: "Informe o seu Nome e sobrenome",
                      value: 3,
                    },
                  })}
                />
                {errors.customer && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.customer.message}
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
                  <InputMask
                    mask="(99) 99999-9999"
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Label htmlFor="customer" className="text-base mb-2">
                    CNPJ:
                  </Label>
                  <InputMask
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    mask="99.999.999/9999-99"
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
                  <InputMask
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    mask="99999-999"
                    id="cep"
                    {...register("cep", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: { message: "Informe um cep válido", value: 9 },
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
              </div>
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
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="street" className="text-base mb-2">
                    Cidade:
                  </Label>
                  <Input
                    id="city"
                    {...register("city", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe a Cidade",
                        value: 3,
                      },
                    })}
                  />

                  {errors.city && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="neighborhood" className="text-base mb-2">
                    UF:
                  </Label>
                  <Input
                    id="state"
                    {...register("state", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe o UF",
                        value: 2,
                      },
                    })}
                  />

                  {errors.state && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

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
                <Label htmlFor="businessMoment" className="text-base mb-2">
                  Qual o momento atual do empreendimento?
                </Label>
                <Select>
                  <SelectTrigger>
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

                {errors.businessMoment && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.businessMoment.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <Label htmlFor="customer" className="text-base mb-2">
                  Possui engenharia clínica para apoiar o processo de seleção
                  dos equipamentos?
                </Label>
                <RadioGroup
                  className="flex mt-2"
                  defaultValue={hasClinicalEngineering}
                  onValueChange={handleFirstChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="sim" />
                    <Label htmlFor="sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="nao" />
                    <Label htmlFor="não">Não</Label>
                  </div>
                </RadioGroup>
              </div>
              {hasClinicalEngineering === "sim" && (
                <div className="flex flex-col mt-4">
                  <Label htmlFor="customer" className="text-base mb-2">
                    Como é a sua Engenharia Clínica?
                  </Label>
                  <RadioGroup defaultValue="propria" className="flex mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="propria" id="propria" />
                      <Label htmlFor="propria">Própria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="terceirizada" id="option-two" />
                      <Label htmlFor="terceirizada">Terceirizada</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <div className="flex flex-col mt-4">
                <Label htmlFor="customer" className="text-base mb-2">
                  Do que sente mais falta no suporte da engenharia clinica?
                </Label>
                <Textarea
                  placeholder="Escreva aqui..."
                  id="needing"
                  {...register("needing", {})}
                />
              </div>

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
              <h2 className="font-semibold text-3xl mb-8">
                Estamos quase lá...
              </h2>
              <div className="flex flex-col mt-4">
                <Label htmlFor="customer" className="text-base mb-2">
                  Hospital irá implantar uma nova CME ou já possui CME?
                </Label>
                <RadioGroup
                  className="flex mt-2"
                  defaultValue={hasClinicalEngineering}
                  onValueChange={handleFirstChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Irei implantar" id="option-one" />
                    <Label htmlFor="Irei implantar">Irei implantar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Já possuo" id="option-two" />
                    <Label htmlFor="Já possuo">Já possuo</Label>
                  </div>
                </RadioGroup>
              </div>
              {hasClinicalEngineering === "Já possuo" && (
                <div className="flex flex-col mt-4">
                  <Label htmlFor="customer" className="text-base mb-2">
                    Se você já possui uma CME, o que você busca?
                  </Label>
                  <RadioGroup defaultValue="propria" className="flex mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="propria" id="option-one" />
                      <Label htmlFor="propria">Quero substituir</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="terceirizada" id="option-two" />
                      <Label htmlFor="terceirizada">Quero ampliar</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <div className="flex flex-col mt-4 w-full">
                <Label htmlFor="hospitalEmail" className="text-base mb-2">
                  As cirurgias serão realizadas em quais dias da semana?
                </Label>
                <div className="flex flex-col justify-start gap-3 lg:flex-col">
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allDays"
                        checked={selectedDays.allDays}
                        onChange={handleAllDaysChange}
                      />
                      <label
                        htmlFor="allDays"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Todos os dias
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="monday"
                        checked={selectedDays.monday}
                        onChange={handleDayChange("monday")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="monday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Segunda-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tuesday"
                        checked={selectedDays.tuesday}
                        onChange={handleDayChange("tuesday")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="tuesday"
                        className="text-sm font-medium leading-none"
                      >
                        Terça-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wednesday"
                        checked={selectedDays.wednesday}
                        onChange={handleDayChange("wednesday")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="wednesday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Quarta-feira
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thursday"
                        checked={selectedDays.thursday}
                        onChange={handleDayChange("thursday")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="thursday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Quinta-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="friday"
                        checked={selectedDays.friday}
                        onChange={handleDayChange("friday")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="friday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sexta-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saturday"
                        checked={selectedDays.saturday}
                        onChange={handleDayChange("saturday")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="saturday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sábado
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sunday"
                        checked={selectedDays.sunday}
                        onChange={handleDayChange("sunday")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="sunday"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Domingo
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <Label htmlFor="customer" className="text-base mb-2">
                  Qual o intervalo de pico de funcionamento da CME em{" "}
                  <strong>horas</strong>?
                  <br />{" "}
                  <span className="text-sm text-[#a7b928]">
                    (período de processamento de 90% do material)
                  </span>
                </Label>
                <Input
                  id="intervalCMEHour"
                  placeholder="Ex.: 12"
                  {...register("intervalCMEHour", {
                    required: { message: "Preencha este campo", value: true },
                  })}
                />
                {errors.intervalCMEHour && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.intervalCMEHour.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="customer" className="text-base mb-2">
                    Qual o tipo de processamento?
                  </Label>
                  <Select>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elaboração projetos">
                        Tecidos
                      </SelectItem>
                      <SelectItem value="Visita técnica para avaliação diagnóstica">
                        Apenas instrumental
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {errors.customer && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.customer.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numberOfSurgery" className="text-base mb-2">
                    Número de salas cirúrgicas
                  </Label>
                  <Input
                    id="numberOfSurgery"
                    type="text"
                    {...register("numberOfSurgery", {
                      required: { message: "Preencha este campo", value: true },
                    })}
                  />

                  {errors.numberOfSurgery && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numberOfSurgery.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label
                    htmlFor="numberSurgeryRoomDay"
                    className="text-base mb-2"
                  >
                    Número de cirurgias/sala/dia
                  </Label>
                  <Input
                    id="numberSurgeryRoomDay"
                    type="text"
                    {...register("numberSurgeryRoomDay", {
                      required: { message: "Preencha este campo", value: true },
                    })}
                  />

                  {errors.numberSurgeryRoomDay && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numberSurgeryRoomDay.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numberBedUTI" className="text-base mb-2">
                    Número de leitos UTI
                  </Label>
                  <Input
                    id="numberBedUTI"
                    {...register("numberBedUTI", {
                      required: { message: "Preencha este campo", value: true },
                    })}
                  />

                  {errors.numberBedUTI && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numberBedUTI.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numberBedIntern" className="text-base mb-2">
                    Número de leitos Internação
                  </Label>
                  <Input
                    id="numberBedIntern"
                    type="text"
                    {...register("numberBedIntern", {
                      required: { message: "Preencha este campo", value: true },
                    })}
                  />

                  {errors.numberBedIntern && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numberBedIntern.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numberBedRPA" className="text-base mb-2">
                    Número de leitos RPA
                  </Label>
                  <Input
                    id="numberBedRPA"
                    {...register("numberBedRPA", {
                      required: { message: "Preencha este campo", value: true },
                    })}
                  />

                  {errors.numberBedRPA && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numberBedRPA.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numberBedObs" className="text-base mb-2">
                    Número de leitos Observações
                  </Label>
                  <Input
                    id="numberBedObs"
                    type="text"
                    {...register("numberBedObs", {
                      required: { message: "Preencha este campo", value: true },
                    })}
                  />

                  {errors.numberBedObs && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numberBedObs.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label
                    htmlFor="numberBedHospitalDay"
                    className="text-base mb-2"
                  >
                    Número de leitos Hospital Dia
                  </Label>
                  <Input
                    id="numberBedHospitalDay"
                    {...register("numberBedHospitalDay", {
                      required: { message: "Preencha este campo", value: true },
                    })}
                  />

                  {errors.numberBedHospitalDay && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numberBedHospitalDay.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="block mt-6">
                <input
                  {...register("acceptOneReport", {
                    required: true,
                  })}
                  name="acceptOneReport"
                  className="p-3 text-[#a7b928] rounded mr-3 border-2 border-gray-300 ring-0 focus:ring-0 focus:ring-offset-0 focus:border-0 cursor-pointer"
                  type="checkbox"
                />
                <span>
                  Estou ciente que posso gerar esse relatório apenas uma vez.
                </span>
              </div>
              <div className="block mt-1">
                <input
                  {...register("acceptContact", {
                    required: true,
                  })}
                  name="acceptContact"
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
                Conferir resultado
              </button>
            </section>
          )}
          {formStep === 3 && (
            <section>
              <h2 className="font-semibold text-3xl mb-8">
                Confira o resultado!
              </h2>
              <p>Informações geradas baseada nos cálculos...</p>
              <button
                onClick={() => alert("Mostra um dialog legal aqui")}
                className="mt-6 bg-[#a7b928] text-white text-lg py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 "
              >
                <FontAwesomeIcon icon={faChartPie} className="mr-2" size="lg" />
                Solicitar um relatório detalhado
              </button>
            </section>
          )}

          {/* <p className="mt-10">{isValid ? "Valid" : "Invalid"}</p>
          <pre className="text-sm text-gray-700">
            {JSON.stringify(watch(), null, 2)}
          </pre> */}
        </form>
      </div>
    </div>
  );
};

export default StepForm;
