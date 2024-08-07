import { faArrowLeft, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import Swal from "sweetalert2";

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axios from "axios";

const STEPS_AMOUNT = 3;

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

interface SelectedDays {
  todosDias: boolean;
  segunda: boolean;
  terca: boolean;
  quarta: boolean;
  quinta: boolean;
  sexta: boolean;
  sabado: boolean;
  domingo: boolean;
}

interface FormValues {
  nomeLead: string;
  hospitalNome: string;
  hospitalEmail: string;
  hospitalContato: string;
  cnpj: string;
  cargo: string;
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  numeroSalasCirurgicas: number;
  numeroCirurgiaSalaDia: number;
  numeroLeitoUTI: number;
  numeroLeitoInternacao: number;
  numeroLeitoRPA: number;
  numeroLeitoObs: number;
  numeroLeitoHospitalDia: number;
  momentoAtualEmpreendimento: string;
  possuiEngenhariaClinica: string;
  tipoEngenhariaClinica: string;
  precisaCME: string;
  busco: string;
  diaSemanaCirurgia: string[];
  intervaloPicoCME: string;
  processaTecido: string;
  aceitarTermos: string;
  obsEngenhariaClinica: string;
}

const StepForm: React.FC = () => {
  const [formStep, setFormStep] = useState<number>(0);
  //   const [id, setId] = useState<number | null>(null);
  //   const [leadId, setLeadId] = useState<number | undefined>(undefined); // Estado para armazenar o ID

  const [leadData, setLeadData] = useState<any>(null);

  const [hasClinicalEngineering, setHasClinicalEngineering] =
    useState<string>("nulo");
  const [typeClinicalEngineering, setTypeClinicalEngineering] =
    useState<string>("nulo");

  const [hasCME, setHasCME] = useState<string>("irei-implantar");

  const [seekCME, setSeekCME] = useState<string>("nulo");

  const [isAllDaysChecked, setIsAllDaysChecked] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({
    todosDias: false,
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  });

  const handleAllDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAllDaysChecked(checked);
    const newSelectedDays = {
      todosDias: checked,
      segunda: checked,
      terca: checked,
      quarta: checked,
      quinta: checked,
      sexta: checked,
      sabado: checked,
      domingo: checked,
    };
    setSelectedDays(newSelectedDays);
    updateDiaSemanaCirurgia(newSelectedDays);
  };

  const handleDayChange =
    (day: keyof SelectedDays) => (e: ChangeEvent<HTMLInputElement>) => {
      const newSelectedDays = {
        ...selectedDays,
        [day]: e.target.checked,
        todosDias: false,
      };
      setSelectedDays(newSelectedDays);
      updateDiaSemanaCirurgia(newSelectedDays);
    };

  const updateDiaSemanaCirurgia = (newSelectedDays: SelectedDays) => {
    let days: string[];
    if (newSelectedDays.todosDias) {
      days = ["todosDias"];
    } else {
      days = Object.keys(newSelectedDays).filter(
        (day) =>
          day !== "todosDias" && newSelectedDays[day as keyof SelectedDays]
      );
    }
    setValue("diaSemanaCirurgia", days);
  };
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      possuiEngenhariaClinica: "Não",
      tipoEngenhariaClinica: "Não selecionado",
      busco: "Não selecionado",
    },
  });

  const cepValue = watch("cep");

  const handleBusinessMomentChange = (value: string) => {
    setValue("momentoAtualEmpreendimento", value);
  };
  const handleHasClinicalEngineeringChange = (value: string) => {
    setHasClinicalEngineering(value);
    setValue("possuiEngenhariaClinica", value);
  };
  const handleTypeClinicalEngineeringChange = (value: string) => {
    setTypeClinicalEngineering(value);
    setValue("tipoEngenhariaClinica", value);
  };

  const handleHasCMEChange = (value: string) => {
    setHasCME(value);
    setValue("precisaCME", value);
    if (value !== "Ja possuo") {
      setValue("busco", "Não selecionado");
    }
  };

  const handleSeekCMEChange = (value: string) => {
    setSeekCME(value);
    setValue("busco", value);
  };

  useEffect(() => {
    if (hasCME !== "Ja possuo") {
      setValue("busco", "Não selecionado");
    }
  }, [hasCME, setValue]);

  const handleProcessTypeChange = (value: string) => {
    setValue("processaTecido", value);
  };

  useEffect(() => {
    const cleanedCep = cepValue?.replace(/\D/g, "");
    if (cleanedCep?.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cleanedCep}/json/`)
        .then((response) => {
          const { logradouro, bairro, localidade, uf } = response.data;
          setValue("rua", logradouro);
          setValue("bairro", bairro);
          setValue("cidade", localidade);
          setValue("estado", uf);
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP:", error);
        });
    }
  }, [cepValue, setValue]);

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [lastCheckedEmail, setLastCheckedEmail] = useState("");

  const handleCheckEmailExists = async (
    values: FormValues
  ): Promise<boolean> => {
    console.log(JSON.stringify(values, null, 2));
    try {
      const emailCheckResponse = await axios.post(
        "http://localhost:8000/lead/formcheck",
        {
          hospitalEmail: values.hospitalEmail,
        }
      );
      if (emailCheckResponse.data.exists) {
        console.log(
          "Este e-mail já está registrado. Por favor, use outro e-mail."
        );
        Swal.fire({
          title: "Ops!",
          text: "Parece que você já obteve nossas recomendações!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#a7b928",
          cancelButtonColor: "#d33",
          confirmButtonText: "Solicitar novas recomendações",
          cancelButtonText: "Fechar",
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(
              "https://api.whatsapp.com/send?phone=5524981191448&text=Ol%C3%A1,%20vim%20pelo%20site%20e%20gostaria%20de%20solicitar%20uma%20nova%20recomenda%C3%A7%C3%A3o%20de%20Autoclaves%20e%20Lavadoras!",
              "_blank"
            );
          }
        });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao enviar os dados para a API", error);
      return false;
    }
  };

  const handleStepCompletion = async (values: FormValues) => {
    const currentEmail = values.hospitalEmail;

    if (!isEmailChecked || currentEmail !== lastCheckedEmail) {
      const emailExists = await handleCheckEmailExists(values);
      setIsEmailChecked(true);
      setIsEmailValid(!emailExists);
      setLastCheckedEmail(currentEmail);

      if (!emailExists) {
        setFormStep((cur) => cur + 1);
      }
    } else if (isEmailValid) {
      setFormStep((cur) => cur + 1);
    }
  };

  const handleNext = async () => {
    const values = getValues();
    await handleStepCompletion(values);
  };

  const handleGoBackToPreviousStep = () => {
    setFormStep((cur) => cur - 1);
  };

  interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
  }

  const Checkbox: React.FC<CheckboxProps> = ({
    id,
    checked,
    onChange,
    disabled,
  }) => {
    return (
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-checkbox h-4 w-4 checked:bg-[#A4BA25] text-white transition duration-150 ease-in-out"
      />
    );
  };

  interface LabelProps {
    htmlFor: string;
    children: React.ReactNode;
    className?: string;
  }

  const Label: React.FC<LabelProps> = ({ htmlFor, children, className }) => {
    return (
      <label htmlFor={htmlFor} className={className}>
        {children}
      </label>
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    try {
      const response = await axios.post("http://localhost:8000/lead", values);
      console.log("Dados enviados com sucesso:", response.data);

      await getRecommendations(response.data.lead);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro da API:", error.response?.data);
      } else {
        console.error("Erro ao enviar os dados para a API:", error);
      }
    }
  };

  const getRecommendations = async (lead: any) => {
    try {
      const lastId = lead.id;
      console.log(`O id que está sendo enviado é: ${lastId}`);

      const response = await axios.get(`http://localhost:8000/lead/${lastId}`);
      console.log("Detalhes do lead:", response.data);

      setLeadData(response.data);
    } catch (error) {
      console.error("Erro ao obter recomendações:", error);
    }
  };

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
                  id="nomeLead"
                  placeholder="Informe o seu nome"
                  {...register("nomeLead", {
                    required: { message: "Preencha este campo", value: true },
                    minLength: {
                      message: "Informe o seu Nome e sobrenome",
                      value: 3,
                    },
                  })}
                />
                {errors.nomeLead && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.nomeLead.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="hospitalEmail" className="text-base mb-2">
                    E-mail do hospital:
                  </Label>
                  <input
                    id="hospitalEmail"
                    type="email"
                    placeholder="email@email.com"
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-250"
                    {...register("hospitalEmail", {
                      required: { value: true, message: "Preencha este campo" },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Informe um e-mail válido!",
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
                    placeholder="(00) 00000-0000"
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="hospitalContato"
                    {...register("hospitalContato", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe um número válido!",
                        value: 10,
                      },
                    })}
                  />

                  {errors.hospitalContato && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.hospitalContato.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <Label htmlFor="hospitalName" className="text-base mb-2">
                  Nome do hospital:
                </Label>
                <Input
                  id="hospitalNome"
                  placeholder="Informe o nome do hospital"
                  {...register("hospitalNome", {
                    required: { message: "Preencha este campo", value: true },
                    minLength: {
                      message: "Preencha com o nome do hospital",
                      value: 3,
                    },
                  })}
                />
                {errors.hospitalNome && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.hospitalNome.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="customer" className="text-base mb-2">
                    CNPJ:{" "}
                    <span className="text-sm text-[#a7b928]">(opcional)</span>
                  </Label>
                  <InputMask
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-250"
                    mask="99.999.999/9999-99"
                    placeholder="00.000.000/0000-00"
                    id="cnpj"
                  />
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="role" className="text-base mb-2">
                    Seu cargo atual:
                  </Label>
                  <Input
                    id="cargo"
                    placeholder="Ex:. Diretor"
                    {...register("cargo", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: { message: "Informe um cargo", value: 3 },
                    })}
                  />

                  {errors.cargo && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.cargo.message}
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
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-250"
                    mask="99999-999"
                    placeholder="00000-000"
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
                  <Label htmlFor="numero" className="text-base mb-2">
                    Número:
                  </Label>
                  <Input
                    id="numero"
                    placeholder="Ex:. 42"
                    {...register("numero", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe um número válido",
                        value: 1,
                      },
                    })}
                  />

                  {errors.numero && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numero.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-4 w-full">
                <Label htmlFor="street" className="text-base mb-2">
                  Avenida/Rua:
                </Label>
                <Input
                  id="rua"
                  placeholder="Informe o nome da Avenida/Rua"
                  {...register("rua", {
                    required: { message: "Preencha este campo", value: true },
                    minLength: {
                      message: "Informe a rua ou avenida",
                      value: 3,
                    },
                  })}
                />

                {errors.rua && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.rua.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mt-4 w-full">
                <Label htmlFor="neighborhood" className="text-base mb-2">
                  Bairro:
                </Label>
                <Input
                  id="bairro"
                  placeholder="Informe o nome do Bairro"
                  {...register("bairro", {
                    required: { message: "Preencha este campo", value: true },
                    minLength: {
                      message: "Informe o nome do Bairro",
                      value: 3,
                    },
                  })}
                />

                {errors.bairro && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.bairro.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="street" className="text-base mb-2">
                    Cidade:
                  </Label>
                  <Input
                    id="cidade"
                    placeholder="Informe o nome da Cidade"
                    {...register("cidade", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe a Cidade",
                        value: 3,
                      },
                    })}
                  />

                  {errors.cidade && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.cidade.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="neighborhood" className="text-base mb-2">
                    UF:
                  </Label>
                  <Input
                    id="estado"
                    placeholder="Informe o nome do Estado"
                    {...register("estado", {
                      required: { message: "Preencha este campo", value: true },
                      minLength: {
                        message: "Informe o UF",
                        value: 2,
                      },
                    })}
                  />

                  {errors.estado && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.estado.message}
                    </p>
                  )}
                </div>
              </div>

              <FinishSectionButton onClick={handleNext} isDisabled={!isValid}>
                Próximo
              </FinishSectionButton>
            </section>
          )}
          {formStep >= 1 && (
            <section className={`${formStep === 1 ? "block" : "hidden"}`}>
              <h2 className="font-semibold text-3xl mb-8">Momento atual...</h2>
              <div className="flex flex-col mt-4">
                <Label
                  htmlFor="momentoAtualEmpreendimento"
                  className="text-base mb-2"
                >
                  Qual o momento atual do empreendimento?
                </Label>
                <Select
                  onValueChange={handleBusinessMomentChange}
                  {...register("momentoAtualEmpreendimento", {
                    required: { message: "Selecione uma opção", value: true },
                  })}
                >
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

                {errors.momentoAtualEmpreendimento && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.momentoAtualEmpreendimento.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <Label
                  htmlFor="possuiEngenhariaClinica"
                  className="text-base mb-2"
                >
                  Possui engenharia clínica para apoiar o processo de seleção
                  dos equipamentos?
                </Label>
                <RadioGroup
                  className="flex mt-2"
                  onValueChange={handleHasClinicalEngineeringChange}
                  defaultValue="nao"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="sim"
                      id="sim"
                      {...register("possuiEngenhariaClinica", {
                        required: {
                          message: "Selecione uma opção",
                          value: true,
                        },
                      })}
                    />
                    <Label htmlFor="sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="nao"
                      id="nao"
                      {...register("possuiEngenhariaClinica", {
                        required: {
                          message: "Selecione uma opção",
                          value: true,
                        },
                      })}
                    />
                    <Label htmlFor="nao">Não</Label>
                  </div>
                </RadioGroup>
                {errors.possuiEngenhariaClinica && (
                  <p>{errors.possuiEngenhariaClinica.message}</p>
                )}
              </div>

              {hasClinicalEngineering === "sim" && (
                <div className="flex flex-col mt-4">
                  <Label
                    htmlFor="tipoEngenhariaClinica"
                    className="text-base mb-2"
                  >
                    Como é a sua Engenharia Clínica?
                  </Label>
                  <RadioGroup
                    defaultValue={typeClinicalEngineering}
                    className="flex mt-2"
                    onValueChange={handleTypeClinicalEngineeringChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Própria"
                        id="propria"
                        {...register("tipoEngenhariaClinica", {
                          required: {
                            value: hasClinicalEngineering === "sim",
                            message: "Selecione uma opção",
                          },
                        })}
                      />
                      <Label htmlFor="propria">Própria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Terceirizada"
                        id="terceirizada"
                        {...register("tipoEngenhariaClinica", {
                          required: {
                            value: hasClinicalEngineering === null,
                            message: "Selecione uma opção",
                          },
                        })}
                      />
                      <Label htmlFor="terceirizada">Terceirizada</Label>
                    </div>
                  </RadioGroup>
                  {errors.tipoEngenhariaClinica && (
                    <p>{errors.tipoEngenhariaClinica.message}</p>
                  )}
                </div>
              )}
              <div className="flex flex-col mt-4">
                <Label
                  htmlFor="obsEngenhariaClinica"
                  className="text-base mb-2"
                >
                  Do que sente mais falta no suporte da engenharia clinica?{" "}
                  <span className="text-sm text-[#a7b928]">(opcional)</span>
                </Label>
                <Textarea
                  placeholder="Escreva aqui..."
                  id="obsEngenhariaClinica"
                  {...register("obsEngenhariaClinica", {})}
                />
              </div>

              <FinishSectionButton onClick={handleNext} isDisabled={!isValid}>
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
                <Label htmlFor="precisaCME" className="text-base mb-2">
                  Hospital irá implantar uma nova CME ou já possui CME?
                </Label>
                <RadioGroup
                  className="flex mt-2"
                  defaultValue="Irei implantar"
                  onValueChange={handleHasCMEChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Irei implantar"
                      id="irei-implantar"
                      {...register("precisaCME", {
                        required: {
                          message: "Selecione uma opção",
                          value: true,
                        },
                      })}
                    />
                    <Label htmlFor="irei-implantar">Irei implantar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Ja possuo"
                      id="ja-possuo"
                      {...register("precisaCME", {
                        required: {
                          message: "Selecione uma opção",
                          value: true,
                        },
                      })}
                    />
                    <Label htmlFor="ja-possuo">Já possuo</Label>
                  </div>
                </RadioGroup>
                {errors.precisaCME && <p>{errors.precisaCME.message}</p>}
              </div>

              {hasCME === "Ja possuo" && (
                <div className="flex flex-col mt-4">
                  <Label htmlFor="customer" className="text-base mb-2">
                    Se você já possui uma CME, o que você busca?
                  </Label>
                  <RadioGroup
                    defaultValue={seekCME}
                    onValueChange={handleSeekCMEChange}
                    className="flex mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Substituir"
                        id="quero-substituir"
                        {...register("busco", {
                          required: {
                            value: hasCME === "Ja possuo",
                            message: "Selecione uma opção",
                          },
                        })}
                      />
                      <Label htmlFor="quero-substituir">Quero substituir</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Ampliar"
                        id="quero-ampliar"
                        {...register("busco", {
                          required: {
                            value: hasCME === "Ja possuo",
                            message: "Selecione uma opção",
                          },
                        })}
                      />
                      <Label htmlFor="quero-ampliar">Quero ampliar</Label>
                    </div>
                  </RadioGroup>
                  {errors.busco && <p>{errors.busco.message}</p>}
                </div>
              )}
              <div className="flex flex-col mt-4 w-full">
                <Label htmlFor="diaSemanaCirurgia" className="text-base mb-2">
                  As cirurgias serão realizadas em quais dias da semana?
                </Label>
                <div className="flex flex-col justify-start gap-3 lg:flex-col">
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="todosDias"
                        checked={selectedDays.todosDias}
                        onChange={handleAllDaysChange}
                      />
                      <label
                        htmlFor="todosDias"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Todos os dias
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="segunda"
                        checked={selectedDays.segunda}
                        onChange={handleDayChange("segunda")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="segunda"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Segunda-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terca"
                        checked={selectedDays.terca}
                        onChange={handleDayChange("terca")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="terca"
                        className="text-sm font-medium leading-none"
                      >
                        Terça-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="quarta"
                        checked={selectedDays.quarta}
                        onChange={handleDayChange("quarta")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="quarta"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Quarta-feira
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="quinta"
                        checked={selectedDays.quinta}
                        onChange={handleDayChange("quinta")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="quinta"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Quinta-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sexta"
                        checked={selectedDays.sexta}
                        onChange={handleDayChange("sexta")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="sexta"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sexta-feira
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sabado"
                        checked={selectedDays.sabado}
                        onChange={handleDayChange("sabado")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="sabado"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sábado
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="domingo"
                        checked={selectedDays.domingo}
                        onChange={handleDayChange("domingo")}
                        disabled={isAllDaysChecked}
                      />
                      <label
                        htmlFor="domingo"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Domingo
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <Label htmlFor="intervaloPicoCME" className="text-base mb-2">
                  Qual o intervalo de pico de funcionamento da CME em{" "}
                  <strong>horas</strong>?
                  <br />{" "}
                  <span className="text-sm text-[#a7b928]">
                    (período de processamento de 90% do material)
                  </span>
                </Label>
                <Input
                  id="intervaloPicoCME"
                  type="number"
                  placeholder=" Ex:. 12"
                  {...register("intervaloPicoCME", {
                    required: {
                      message: "Preencha este campo em horas",
                      value: true,
                    },
                  })}
                />
                {errors.intervaloPicoCME && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.intervaloPicoCME.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="tipoProcessamento" className="text-base mb-2">
                    Deseja processar os tecidos?
                  </Label>
                  <Select
                    onValueChange={handleProcessTypeChange}
                    {...register("processaTecido", {
                      required: { message: "Selecione uma opção", value: true },
                    })}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sim</SelectItem>
                      <SelectItem value="1">Não</SelectItem>
                    </SelectContent>
                  </Select>

                  {errors.processaTecido && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.processaTecido.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label
                    htmlFor="numeroSalasCirurgias"
                    className="text-base mb-2"
                  >
                    Número de salas cirúrgicas
                  </Label>
                  <Input
                    id="numeroSalasCirurgias"
                    placeholder=" Ex.: 6"
                    type="number"
                    {...register("numeroSalasCirurgicas", {
                      required: {
                        message: "Preencha com a quantidade",
                        value: true,
                      },
                    })}
                  />

                  {errors.numeroSalasCirurgicas && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numeroSalasCirurgicas.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label
                    htmlFor="numeroCirurgiaSalaDia"
                    className="text-base mb-2"
                  >
                    Número de cirurgias/sala/dia
                  </Label>
                  <Input
                    id="numeroCirurgiaSalaDia"
                    placeholder=" Ex.: 10"
                    type="number"
                    {...register("numeroCirurgiaSalaDia", {
                      required: {
                        message: "Preencha com a quantidade",
                        value: true,
                      },
                    })}
                  />

                  {errors.numeroCirurgiaSalaDia && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numeroCirurgiaSalaDia.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numeroLeitoUTI" className="text-base mb-2">
                    Número de leitos UTI
                  </Label>
                  <Input
                    type="number"
                    id="numeroLeitoUTI"
                    placeholder=" Ex.: 30"
                    {...register("numeroLeitoUTI", {
                      required: {
                        message: "Preencha com a quantidade",
                        value: true,
                      },
                    })}
                  />

                  {errors.numeroLeitoUTI && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numeroLeitoUTI.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label
                    htmlFor="numeroLeitoInternacao"
                    className="text-base mb-2"
                  >
                    Número de leitos Internação
                  </Label>
                  <Input
                    id="numeroLeitoInternacao"
                    placeholder=" Ex.: 80"
                    type="number"
                    {...register("numeroLeitoInternacao", {
                      required: {
                        message: "Preencha com a quantidade",
                        value: true,
                      },
                    })}
                  />

                  {errors.numeroLeitoInternacao && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numeroLeitoInternacao.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numeroLeitoRPA" className="text-base mb-2">
                    Número de leitos RPA
                  </Label>
                  <Input
                    type="number"
                    id="numeroLeitoRPA"
                    placeholder=" Ex.: 35"
                    {...register("numeroLeitoRPA", {
                      required: {
                        message: "Preencha com a quantidade",
                        value: true,
                      },
                    })}
                  />

                  {errors.numeroLeitoRPA && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numeroLeitoRPA.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex flex-col mt-4 w-full">
                  <Label htmlFor="numeroLeitoObs" className="text-base mb-2">
                    Número de leitos Observações
                  </Label>
                  <Input
                    id="numeroLeitoObs"
                    placeholder=" Ex.: 14"
                    type="number"
                    {...register("numeroLeitoObs", {
                      required: {
                        message: "Preencha com a quantidade",
                        value: true,
                      },
                    })}
                  />

                  {errors.numeroLeitoObs && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numeroLeitoObs.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-4 w-full">
                  <Label
                    htmlFor="numeroLeitoHospitalDia"
                    className="text-base mb-2"
                  >
                    Número de leitos Hospital Dia
                  </Label>
                  <Input
                    type="number"
                    placeholder=" Ex.: 20"
                    id="numeroLeitoHospitalDia"
                    {...register("numeroLeitoHospitalDia", {
                      required: {
                        message: "Preencha com a quantidade",
                        value: true,
                      },
                    })}
                  />

                  {errors.numeroLeitoHospitalDia && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.numeroLeitoHospitalDia.message}
                    </p>
                  )}
                </div>
              </div>
              <div className=" mt-6 flex items-center">
                <input
                  {...register("aceitarTermos", {
                    required: true,
                  })}
                  name="aceitarTermos"
                  className="p-3 text-[#a7b928] rounded mr-3  border-2 border-gray-300 ring-0 focus:ring-0 focus:ring-offset-0 focus:border-0 cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm ">
                  Concordo em gerar o relatório apenas uma vez e autorizo o
                  contato da Equipacare.
                </span>
              </div>
              <button
                disabled={!isValid}
                onClick={handleNext}
                // type="submit"
                className="mt-6 bg-[#a7b928] text-white py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Conferir resultado
              </button>
            </section>
          )}
          {formStep === 3 && leadData && (
            <section>
              <h2 className="font-semibold text-3xl mb-8">
                Confira o resultado!
              </h2>
              <h5 className="font-bold text-slate-950 mb-4 antialiased text-lg">
                Autoclaves recomendadas:
              </h5>
              <Table className="rounded">
                <TableHeader className="">
                  <TableRow className="bg-slate-900  rounded-lg">
                    <TableHead className="font-bold text-white">
                      Marca
                    </TableHead>
                    <TableHead className="font-bold text-white">
                      Modelo
                    </TableHead>
                    <TableHead className="text-right font-bold text-white">
                      Faixa de preço
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadData.autoclaveRecommendations &&
                    leadData.autoclaveRecommendations.map(
                      (autoclave: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{autoclave.nomeMarca}</TableCell>
                          <TableCell>{autoclave.modeloAutoclave}</TableCell>
                          <TableCell className="text-right">
                            R${autoclave.preco}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
              <hr />
              <h5 className="font-bold text-slate-950 mb-4 mt-5 antialiased text-lg">
                Lavadoras recomendadas:
              </h5>
              <Table className="rounded">
                <TableHeader className="">
                  <TableRow className="bg-slate-900  rounded-lg">
                    <TableHead className="font-bold text-white">
                      Marca
                    </TableHead>
                    <TableHead className="font-bold text-white">
                      Modelo
                    </TableHead>
                    <TableHead className="text-right font-bold text-white">
                      Faixa de preço
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadData.washerRecommendations &&
                    leadData.washerRecommendations.map(
                      (washer: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{washer.nomeMarca}</TableCell>
                          <TableCell>{washer.modeloLavadora}</TableCell>
                          <TableCell className="text-right">
                            R${washer.preco}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
              <button
                onClick={() =>
                  window.open(
                    "https://api.whatsapp.com/send?phone=5524981191448&text=Ol%C3%A1,%20vim%20pelo%20site%20e%20gostaria%20de%20solicitar%20um%20relatório%20detalhado%20das%20Autoclaves%20e%20Lavadoras!",
                    "_blank"
                  )
                }
                className="mt-6 bg-[#a7b928] text-white text-lg py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#a7b928] hover:text-white hover:shadow-lg transition-all duration-500 w-full disabled:bg-gray-300 "
              >
                <FontAwesomeIcon icon={faChartPie} className="mr-2" size="lg" />
                Solicitar um relatório detalhado
              </button>
            </section>
          )}

          {/* <p className="mt-10">{isValid ? "Válido" : "Inválido"}</p> */}
          <pre className="text-[1px] text-transparent">
            {JSON.stringify(watch(), null, 2)}
          </pre>
        </form>
      </div>
    </div>
  );
};

export default StepForm;
