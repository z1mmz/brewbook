import { useEffect } from "react";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HistoryExtension } from "@lexical/history";
import { RichTextExtension } from "@lexical/rich-text";
import { ListExtension } from "@lexical/list";
import { CodeExtension } from "@lexical/code";
import {
  AutoLinkExtension,
  LinkExtension,
} from "@lexical/link";
import { configExtension, defineExtension } from "lexical";
import { isLexicalJson, normalizeDescription } from "./markdownUtils";
import { recipeTheme } from "./lexicalTheme";
import { recipeAutoLinkMatchers } from "./lexicalLinks";
import ToolbarPlugin from "./lexicalToolbar";

function onError(error) {
  console.error("Lexical error:", error);
}

const recipeEditorExtension = defineExtension({
  name: "RecipeDescription",
  namespace: "RecipeDescription",
  theme: recipeTheme,
  onError,
  dependencies: [
    RichTextExtension,
    HistoryExtension,
    ListExtension,
    CodeExtension,
    LinkExtension,
    configExtension(AutoLinkExtension, {
      matchers: recipeAutoLinkMatchers,
    }),
  ],
});

function EditorValuePlugin({ value }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!isLexicalJson(value)) return;

    const nextState = editor.parseEditorState(normalizeDescription(value));
    const currentState = JSON.stringify(editor.getEditorState().toJSON());
    if (currentState === JSON.stringify(nextState.toJSON())) return;

    editor.setEditorState(nextState);
  }, [editor, value]);

  return null;
}

export default function LexicalRecipeEditor({ value, onChange }) {
  return (
    <LexicalExtensionComposer
      extension={recipeEditorExtension}
      contentEditable={null}
    >
      <div className="lexical-editor-wrapper">
        <ToolbarPlugin />
        <div className="lexical-surface">
          <ContentEditable
            className="lexical-input"
            aria-label="Recipe description"
            aria-placeholder="Tell the story behind this brew..."
            placeholder={
              <div className="lexical-placeholder">
                Tell the story behind this brew...
              </div>
            }
          />
        </div>
        <EditorValuePlugin value={value} />
        <OnChangePlugin
          onChange={(editorState) =>
            onChange(JSON.stringify(editorState.toJSON()))
          }
        />
      </div>
    </LexicalExtensionComposer>
  );
}
