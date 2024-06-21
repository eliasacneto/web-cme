import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddressForm: React.FC = () => {
  const { register, setValue, watch } = useForm();
  const cepValue = watch("cep");

  useEffect(() => {
    if (cepValue?.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cepValue}/json/`)
        .then((response) => {
          const { logradouro, bairro, localidade, uf } = response.data;
          setValue("street", logradouro);
          setValue("neighborhood", bairro);
          // Adicione outros campos se necessário, como cidade e estado
          setValue("city", localidade);
          setValue("state", uf);
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP:", error);
        });
    }
  }, [cepValue, setValue]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:gap-4">
        <div className="flex flex-col mt-4 w-full">
          <label htmlFor="cep" className="text-base mb-2">
            CEP:
          </label>
          <input
            id="cep"
            {...register("cep", {
              required: { message: "Preencha este campo", value: true },
              minLength: { message: "Informe um cep válido", value: 8 },
            })}
          />
          {/* {errors.cep && <p className="text-sm text-red-600 mt-2">{errors.cep.message}</p>} */}
        </div>

        <div className="flex flex-col mt-4 w-full">
          <label htmlFor="number" className="text-base mb-2">
            Número:
          </label>
          <input
            id="number"
            {...register("number", {
              required: { message: "Preencha este campo", value: true },
              minLength: { message: "Informe um número válido", value: 1 },
            })}
          />
          {/* {errors.number && <p className="text-sm text-red-600 mt-2">{errors.number.message}</p>} */}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-4">
        <div className="flex flex-col mt-4 w-full">
          <label htmlFor="street" className="text-base mb-2">
            Avenida/Rua:
          </label>
          <input
            id="street"
            {...register("street", {
              required: { message: "Preencha este campo", value: true },
              minLength: { message: "Informe a rua ou avenida", value: 3 },
            })}
          />
          {/* {errors.street && <p className="text-sm text-red-600 mt-2">{errors.street.message}</p>} */}
        </div>

        <div className="flex flex-col mt-4 w-full">
          <label htmlFor="neighborhood" className="text-base mb-2">
            Bairro:
          </label>
          <input
            id="neighborhood"
            {...register("neighborhood", {
              required: { message: "Preencha este campo", value: true },
              minLength: { message: "Informe o nome do Bairro", value: 3 },
            })}
          />
          {/* {errors.neighborhood && <p className="text-sm text-red-600 mt-2">{errors.neighborhood.message}</p>} */}
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
