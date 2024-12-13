import "./App.css";
import SignUp from "./components/SignUp";

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-5">
      <h1 className="text-lg">Deep-ML Assistant</h1>
      <SignUp />
    </div>
  );
}

export default App;
