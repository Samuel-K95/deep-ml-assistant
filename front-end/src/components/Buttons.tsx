interface buttonProp {
  title: string;
}

const Buttons = (prop: buttonProp) => {
  return (
    <>
      <button
        className="bg-green-700 rounded-md p-3 text-white border-none text-[16px] font-bold w-1/2"
        id="analyze-btn"
      >
        {prop.title}
      </button>
    </>
  );
};

export default Buttons;
