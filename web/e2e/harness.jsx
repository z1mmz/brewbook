import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import "../src/App.css";
import LexicalRecipeEditor from "../src/components/recipe/lexicalEditor";
import LexicalRecipeRenderer from "../src/components/recipe/lexicalRenderer";
import { plainTextToLexical } from "../src/components/recipe/markdownUtils";

const PRESET = plainTextToLexical("Loaded from storage");

function Harness() {
  const [value, setValue] = useState("");

  return (
    <main>
      <button type="button" id="load-preset" onClick={() => setValue(PRESET)}>
        Load preset
      </button>
      <section id="editor" className="recipe-editor">
        <LexicalRecipeEditor value={value} onChange={setValue} />
      </section>
      <output id="serialized" data-testid="serialized">
        {value}
      </output>
      <section id="renderer">
        <LexicalRecipeRenderer value={value} />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
);
