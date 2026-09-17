import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import {
  $createLinkNode,
  $isLinkNode,
  $toggleLink,
  TOGGLE_LINK_COMMAND,
  formatUrl,
} from "@lexical/link";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";

const BLOCK_TYPES = [
  { label: "Normal", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Quote", value: "quote" },
];

function $getTopLevelElement(selection) {
  const anchorNode = selection.anchor.getNode();
  const topLevel = $findMatchingParent(anchorNode, (node) => {
    const parent = node.getParent();
    return parent !== null && $isRootOrShadowRoot(parent);
  });
  return topLevel ?? anchorNode.getTopLevelElementOrThrow();
}

function applyBlockType(editor, type) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    if (type === "paragraph") {
      $setBlocksType(selection, () => $createParagraphNode());
    } else if (type === "quote") {
      $setBlocksType(selection, () => $createQuoteNode());
    } else {
      $setBlocksType(selection, () => $createHeadingNode(type));
    }
  });
}

function ToolbarButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      className={`tb-btn ${active ? "active" : ""}`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [listType, setListType] = useState(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [currentLinkUrl, setCurrentLinkUrl] = useState("");
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [linkDraft, setLinkDraft] = useState("");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      setBlockType("paragraph");
      setListType(null);
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setIsLink(false);
      setCurrentLinkUrl("");
      return;
    }

    const topLevel = $getTopLevelElement(selection);
    if ($isHeadingNode(topLevel)) setBlockType(topLevel.getTag());
    else if ($isQuoteNode(topLevel)) setBlockType("quote");
    else if ($isCodeNode(topLevel)) setBlockType("code");
    else setBlockType("paragraph");

    const list = $findMatchingParent(selection.anchor.getNode(), (node) =>
      $isListNode(node)
    );
    setListType(list ? list.getListType() : null);

    const link = $findMatchingParent(selection.anchor.getNode(), (node) =>
      $isLinkNode(node)
    );
    setIsLink(link !== null);
    setCurrentLinkUrl(link ? link.getURL() : "");

    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar());
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  const toggleCode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const topLevel = $getTopLevelElement(selection);
      if ($isCodeNode(topLevel)) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  }, [editor]);

  const openLinkEditor = useCallback(() => {
    setLinkDraft(currentLinkUrl);
    setShowLinkEditor(true);
  }, [currentLinkUrl]);

  const applyLink = useCallback(() => {
    const raw = linkDraft.trim();
    if (!raw) return;
    const url = formatUrl(raw);
    const attributes = { rel: "noreferrer", target: "_blank" };

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const existingLink = $findMatchingParent(
        selection.anchor.getNode(),
        (node) => $isLinkNode(node)
      );
      if (selection.isCollapsed() && existingLink === null) {
        const linkNode = $createLinkNode(url, attributes);
        linkNode.append($createTextNode(raw));
        selection.insertNodes([linkNode]);
      } else {
        $toggleLink(url, attributes);
      }
    });
    setShowLinkEditor(false);
  }, [editor, linkDraft]);

  const removeLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setShowLinkEditor(false);
  }, [editor]);

  function handleLinkKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyLink();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setShowLinkEditor(false);
    }
  }

  return (
    <>
      <div className="lexical-toolbar" role="toolbar" aria-label="Formatting tools">
      <select
        id="lexical-block-type"
        name="lexicalBlockType"
        className="tb-select"
        value={blockType}
        onChange={(event) => applyBlockType(editor, event.target.value)}
        aria-label="Block type"
      >
        {BLOCK_TYPES.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <span className="tb-divider" />

      <ToolbarButton
        label="Undo"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo2 />
      </ToolbarButton>

      <span className="tb-divider" />

      <ToolbarButton
        label="Bold"
        active={isBold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline />
      </ToolbarButton>
      <ToolbarButton
        label={isLink ? "Edit link" : "Insert link"}
        active={isLink}
        onClick={openLinkEditor}
      >
        <Link2 />
      </ToolbarButton>

      <span className="tb-divider" />

      <ToolbarButton
        label="Bullet list"
        active={listType === "bullet"}
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={listType === "number"}
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={blockType === "quote"}
        onClick={() =>
          applyBlockType(editor, blockType === "quote" ? "paragraph" : "quote")
        }
      >
        <Quote />
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        active={blockType === "code"}
        onClick={toggleCode}
      >
        <Code />
      </ToolbarButton>

      <span className="tb-divider" />

      <ToolbarButton
        label="Align left"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
      >
        <AlignLeft />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
      >
        <AlignCenter />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
      >
        <AlignRight />
      </ToolbarButton>
      <ToolbarButton
        label="Justify"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
      >
        <AlignJustify />
      </ToolbarButton>
      </div>
      {showLinkEditor && (
        <div className="lexical-link-editor" role="dialog" aria-label="Link editor">
          <input
            id="lexical-link-url"
            name="lexicalLinkUrl"
            className="tb-link-input"
            value={linkDraft}
            onChange={(event) => setLinkDraft(event.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="https://example.com"
            aria-label="Link URL"
            autoFocus
          />
          <button
            type="button"
            className="tb-btn tb-link-apply"
            onClick={applyLink}
            aria-label="Apply link"
          >
            Apply
          </button>
          {isLink && (
            <button
              type="button"
              className="tb-btn tb-link-remove"
              onClick={removeLink}
              aria-label="Remove link"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            className="tb-btn"
            onClick={() => setShowLinkEditor(false)}
            aria-label="Cancel link"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
