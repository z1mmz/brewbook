import { useEffect, useRef, useState } from "react";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { markdownToHtml } from "./markdownUtils";

const initialConfig = {
  namespace: "BrewBookRecipeEditor",
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode],
  onError(error) {
    throw error;
  },
};

function MarkdownSyncPlugin({ value, onChange }) {
  const [editor] = useLexicalComposerContext();
  const lastValue = useRef(null);

  useEffect(() => {
    if (value === lastValue.current) return;
    editor.update(() => {
      $convertFromMarkdownString(value, TRANSFORMERS);
    });
    lastValue.current = value;
  }, [editor, value]);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          lastValue.current = markdown;
          if (markdown !== value) onChange(markdown);
        });
      }}
    />
  );
}

function FormattingToolbar({ onPreview }) {
  const [editor] = useLexicalComposerContext();

  function formatText(format) {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }

  function formatHeading() {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h2"));
      }
    });
  }

  return (
    <div
      className="markdown-toolbar"
      role="toolbar"
      aria-label="Formatting tools"
    >
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => formatText("bold")}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => formatText("italic")}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={formatHeading}
        title="Heading"
      >
        H
      </button>
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="Bullet list"
      >
        • List
      </button>
      <button type="button" onClick={onPreview}>
        Preview
      </button>
      <span className="markdown-hint">
        Visual editor · Markdown saved automatically
      </span>
    </div>
  );
}

export default function MarkdownEditor({ value, onChange }) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="markdown-editor">
      {preview ? (
        <>
          <div
            className="markdown-toolbar"
            role="toolbar"
            aria-label="Formatting tools"
          >
            <button type="button" onClick={() => setPreview(false)}>
              Edit
            </button>
          </div>
          <div
            className="markdown-preview recipe-prose"
            dangerouslySetInnerHTML={{
              __html:
                markdownToHtml(value) ||
                '<p class="muted">Nothing written yet.</p>',
            }}
          />
        </>
      ) : (
        <LexicalComposer initialConfig={initialConfig}>
          <FormattingToolbar onPreview={() => setPreview(true)} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="markdown-surface recipe-prose"
                aria-label="Recipe description"
              />
            }
            placeholder={
              <div className="markdown-placeholder">
                Tell the story behind this brew...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <MarkdownSyncPlugin value={value} onChange={onChange} />
        </LexicalComposer>
      )}
    </div>
  );
}
