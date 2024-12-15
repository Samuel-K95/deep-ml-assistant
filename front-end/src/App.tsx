import { NavLink } from "react-router-dom";
import "./App.css";
import Problem from "./components/Problem";

function App() {
  return (
    <>
      <header className="w-full flex justify-between">
        <div className="flex gap-5">Deep-ML Assistant</div>

        <div className="flex ml-20">
          <NavLink to={"login"}>Sign In</NavLink>
        </div>
      </header>

      <main className="flex flex-col items-center justify-around">
        <Problem />
      </main>
    </>
  );
}

export default App;
