import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const navLinks = [
  {
    link: "#",
    label: "Home",
  },
  {
    link: "#",
    label: "Blog",
  },
  {
    link: "#",
    label: "Serviços",
  },
  {
    link: "#",
    label: "Engenharia Hospitalar",
  },
  {
    link: "#",
    label: "Consultoria e Projetos",
  },
  {
    link: "#",
    label: "Engenharia Clínica",
  },
  {
    link: "#",
    label: "Manutenção e Calibração",
  },
  {
    link: "#",
    label: "Materiais",
  },
  {
    link: "#",
    label: "Clientes",
  },
  {
    link: "#",
    label: "Equipacare Edi",
  },
  {
    link: "#",
    label: "Fix System",
  },
  {
    link: "#",
    label: "Contato",
  },
];

const contactLinks = [
  {
    link: "#",
    label: "contato@equipacare.com.br",
  },
  {
    link: "#",
    label: "+55 (24) 3348 - 7157",
  },
  {
    link: "#",
    label: "+55 (24) 98119 - 1448",
  },
];

const Footer = () => {
  return (
    <>
      <footer className="flex flex-col">
        <div className=" px-10 py-16 bg-[#383838] text-white flex flex-col items-start gap-10 lg:gap-5 lg:flex-row lg:items-start lg:justify-evenly">
          <div className="flex flex-col mt-10 lg-mt-2">
            <img
              src="assets/images/equipacare-logo.png"
              alt="Logo"
              width={200}
              height={100}
            />
            <p className="text-white mt-4  lg:w-[300px] lg:mt-10 antialiased">
              Empresa de Engenharia para Clínicas e Hospitais com foco na
              Inteligência do Negócio.
            </p>
          </div>
          <div>
            <h2 className="text-[#D5D5D5] lg:text-xl font-semibold capitalize">
              Mapa do site
            </h2>

            <ul className="flex flex-col gap-1 mt-2 lg:w-56">
              {navLinks.map((info) => (
                <li key={info.label}>
                  <a
                    href={info.link}
                    className="text-[#A4BA25] hover:font-bold transition-all duration-500"
                  >
                    {info.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[#D5D5D5] lg:text-xl font-semibold capitalize">
              Contato
            </h2>
            <ul className="flex flex-col gap-1 mt-2 lg:w-56 ">
              {contactLinks.map((info) => (
                <li key={info.label}>
                  <a
                    href={info.link}
                    className="text-[#A4BA25] hover:font-bold transition-all duration-500"
                  >
                    {info.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[#D5D5D5] font-semibold lg:text-xl capitalize">
              Acompanhe nossas redes sociais
            </h2>
            <ul className="flex gap-4 mt-4">
              <li className="bg-[#484848] w-16 h-16 p-4 rounded-lg hover:bg-[#505050]">
                <a
                  href="#"
                  className="text-[#A4BA25] hover:font-bold transition-all duration-500  hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    size="2xl"
                    className="text-[#A4BA25] "
                  />
                </a>
              </li>
              <li className="bg-[#484848] w-16 h-16 p-4 rounded-lg hover:bg-[#505050]">
                <a
                  href="#"
                  className="text-[#A4BA25] hover:font-bold transition-all duration-500"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    size="2xl"
                    className="text-[#A4BA25]"
                  />
                </a>
              </li>
              <li className="bg-[#484848] w-16 h-16 p-4 rounded-lg hover:bg-[#505050]">
                <a
                  href="#"
                  className="text-[#A4BA25] hover:font-bold transition-all duration-500"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    size="2xl"
                    className="text-[#A4BA25]"
                  />
                </a>
              </li>
              <li className="bg-[#484848] w-16 h-16 p-4 rounded-lg hover:bg-[#505050]">
                <a
                  href="#"
                  className="text-[#A4BA25] hover:font-bold transition-all duration-500"
                >
                  <FontAwesomeIcon
                    icon={faYoutube}
                    size="2xl"
                    className="text-[#A4BA25]"
                  />
                </a>
              </li>
            </ul>
            <div className="flex gap-5 mt-10">
              <img
                src="assets/images/footer/quality.png"
                alt="selo de qualificação"
                width={100}
                height={100}
              />

              <img
                src="assets/images/footer/gptw.png"
                alt="selo de qualificação"
                width={60}
                height={100}
              />
            </div>
          </div>
        </div>
        <div className="bg-black h-20 flex items-center justify-center">
          <p className="text-gray-400 ">
            Todos os direitos reservados. Feito com 💙 pela{" "}
            <a
              href="#"
              target="_blank"
              className="text-[#A4BA25] hover:font-bold transition-all duration-500"
            >
              DNC.
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
