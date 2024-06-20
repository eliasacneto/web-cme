interface GreenButtonProps {
  text: string;
  icon?: string;
}

const GreenButton = (props: GreenButtonProps) => {
  return (
    <div>
      <button className=" flex  gap-4 bg-[#a7b928] py-3 px-6 uppercase font-bold rounded-md font-econdensed hover:bg-[#303436] hover:text-white transition-all duration-500">
        {props.text}
        {/* <Image
              src={props.icon}
              alt="icon "
              height={24}
              width={24}
              className="hover:text-white"
            /> */}
      </button>
    </div>
  );
};

export default GreenButton;
