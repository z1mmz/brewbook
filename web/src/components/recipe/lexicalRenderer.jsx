import { useEffect } from "react";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextExtension } from "@lexical/rich-text";
import { ListExtension } from "@lexical/list";
import { CodeExtension } from "@lexical/code";
import {
  AutoLinkExtension,
  LinkExtension,
} from "@lexical/link";
import { configExtension, defineExtension } from "lexical";
import { isLexicalJson } from "./markdownUtils";
import { recipeTheme } from "./lexicalTheme";
import { recipeAutoLinkMatchers } from "./lexicalLinks";

function onError(error) {
  console.error("Lexical render error:", error);
}

const recipeReaderExtension = defineExtension({
  name: "RecipeDescriptionReader",
  namespace: "RecipeDescriptionReader",
  theme: recipeTheme,
  editable: false,
  onError,
  dependencies: [
    RichTextExtension,
    ListExtension,
    CodeExtension,
    LinkExtension,
    configExtension(AutoLinkExtension, {
      matchers: recipeAutoLinkMatchers,
    }),
  ],
});

function ReaderValuePlugin({ value }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!isLexicalJson(value)) return;

    const nextState = editor.parseEditorState(value);
    const currentState = JSON.stringify(editor.getEditorState().toJSON());
    if (currentState === JSON.stringify(nextState.toJSON())) return;

    editor.setEditorState(nextState);
  }, [editor, value]);

  return null;
}

export default function LexicalRecipeRenderer({ value }) {
  if (!isLexicalJson(value)) {
    return <div className="recipe-prose">{value}</div>;
  }

  return (
    <LexicalExtensionComposer
      extension={recipeReaderExtension}
      contentEditable={null}
    >
      <ContentEditable className="lexical-readonly" aria-label="Recipe description" />
      <ReaderValuePlugin value={value} />
    </LexicalExtensionComposer>
  );
}