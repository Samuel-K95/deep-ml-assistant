import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { atomone } from "@uiw/codemirror-theme-atomone";
import { EditorView } from "@codemirror/view";

interface prop {
  content: string;
}
const MarkDown = ({ content }: prop) => {
  return (
    <div className="max-w-[100%] overflow-x-auto overflow-y-auto">
      <h3 className="text-md">README.md</h3>
      <CodeMirror
        theme={atomone}
        value={content}
        height="300px"
        maxHeight="300px"
        extensions={[markdown(), EditorView.lineWrapping]}
        editable={true}
        title="readme.md"
        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
      />
    </div>
  );
};

export default MarkDown;
