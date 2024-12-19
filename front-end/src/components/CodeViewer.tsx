import { atomone } from "@uiw/codemirror-theme-atomone";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";

interface propType {
  html: string;
}

function htmlParser(htmlCode: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlCode, "text/html");

  const viewLines = doc.querySelectorAll("div.view-line");

  const codeLines: any = [];

  viewLines.forEach((line) => {
    const spans = line.children;
    let codeLine = Array.from(spans)
      .map((span) => span.textContent)
      .join("");

    if (!codeLines.includes(codeLine)) {
      codeLines.push(codeLine);
    }
  });

  return codeLines.join("\n");
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
