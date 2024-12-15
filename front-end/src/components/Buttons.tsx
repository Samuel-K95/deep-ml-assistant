interface buttonProp {
  title: string;
}

const Buttons = (prop: buttonProp) => {
  const handleclick = () => {};
  return (
    <>
      <button
        className="bg-green-700 rounded-md p-3 text-white border-none text-[16px] font-bold flex"
        id="analyze-btn"
        onClick={handleclick}
      >
        {prop.title}
      </button>
    </>
  );
};

export default Buttons;
