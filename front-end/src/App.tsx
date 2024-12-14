import { NavLink } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-3">
      <h1 className="text-lg">Deep-ML Assistant</h1>
      <NavLink to={"register"}>Sign Up</NavLink>
      <NavLink to={"login"}>Sign In</NavLink>
    </div>
  );
}

export default App;
