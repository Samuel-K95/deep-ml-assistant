import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

import { HashRouter as Router, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<SignIn />} />
      <Route path="register" element={<SignUp />} />
    </Routes>
  </Router>
);
