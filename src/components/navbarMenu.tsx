const NavbarMenu = () => {
  return (
    <>
      <div className="flex fixed items-center justify-between z-40 bg-[#011329] w-screen lg:hidden px-6 py-4 shadow-md">
        <a href="#" className="">
          <img
            className="w-full object-contain"
            src="assets/images/equipacare-logo.png"
            alt="logo"
          />
        </a>
        <a
          href="#"
          target="_blank"
          className="  px-4 py-4 bg-transparent border border-[#A4BA25] text-[#A4BA25] text-sm font-bold rounded-md uppercase  hover:bg-[#A4BA25] hover:text-[#3C3D50] transition-all duration-500 "
        >
          Voltar para o início
        </a>
      </div>
      <header className=" px-12 h-12 md:h-24 flex items-center justify-between bg-[#011329] text-[#A4BA25] antialiased font-bold ">
        <a href="#" className="">
          <img
            className="w-full object-contain "
            src="assets/images/equipacare-logo.png"
            alt="logo"
          />
        </a>
        <div className="">
          <div className="flex items-center gap-5 lg:flex-row lg:gap-0 ">
            <a
              href="#"
              target="_blank"
              className="block  px-4 py-3 bg-transparent border border-[#A4BA25] text-[#A4BA25] text-sm md:text-base font-semibold uppercase rounded-md hover:text-white hover:bg-[#A4BA25] transition-all duration-500 lg:mr-4"
            >
              Voltar para o início
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavbarMenu;
