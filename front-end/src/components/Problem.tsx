import { useState } from "react";
import CodeViewer from "./CodeViewer";
import MarkDown from "./MarkDown";
import Buttons from "./Buttons";

const Problem = () => {
  let [problemTitle, setProblemTitle] = useState("");
  let [currentCode, setCurrentCode] = useState(``);
  let [currentProblem, setCurrentProblem] = useState("");
  chrome.storage.session.get(null, (data) => {
    setProblemTitle(data.title);
    setCurrentCode(data.currentCode);
    setCurrentProblem(data.problem);
  });

  return (
    <div className="w-1/2 flex flex-col gap-10 p-10">
      <h2 className="text-lg">Problem Title : {problemTitle}</h2>
      <CodeViewer html={currentCode} />
      <MarkDown content={problemTitle + "\n" + currentProblem} />
      <div className="w-full flex justify-between items-center">
        <div>
          Select the Repository: <select>Repositories</select>
        </div>

        <div>
          <Buttons title="Push" />
        </div>
      </div>
    </div>
  );
};

export default Problem;
