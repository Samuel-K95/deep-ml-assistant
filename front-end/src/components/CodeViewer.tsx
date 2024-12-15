import { atomone } from "@uiw/codemirror-theme-atomone";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";

interface propType {
  html: string;
}

function htmlParser(htmlText: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  const mirror = doc.querySelector(".CodeMirror-code");
  if (!mirror) {
    return "";
  }
  const ma = mirror.querySelectorAll("div");
  const lines = Array.from(ma).map((div) => div.textContent!.slice(1));
  const final = lines.filter((line) => line.length >= 1);
  let ans = "";
  let nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  final.map((val) => {
    let temp = false;
    nums.map((num) => {
      if (num === val[0]) {
        temp = true;
      }
    });
    if (temp) {
      val = val.slice(1);
    }
    if (val) {
      if (ans) {
        ans += "\n" + val;
      } else {
        ans += val;
      }
    }
  });
  console.log(ans);
  return ans;
}

const CodeViewer = ({ html }: propType) => {
  let stripped = htmlParser(html);
  return (
    <div>
      <h3 className="text-md">Solution.py</h3>
      <CodeMirror
        theme={atomone}
        value={stripped}
        height="300px"
        extensions={[python()]}
        editable={false}
        title="soution.py"
      />
    </div>
  );
};

export default CodeViewer;
