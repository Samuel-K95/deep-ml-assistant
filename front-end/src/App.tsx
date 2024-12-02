import "./App.css";
import Buttons from "./components/Buttons";

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-5">
      <img src="logo.png" alt="logo" className="w-[15%] h-[15%]" />
      <h1 className="text-lg">Deep-ML Assistant</h1>
      <Buttons title={"Login"} />
    </div>
  );
}

export default App;
