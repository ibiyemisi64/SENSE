import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

function RichTextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <div>
      <button onClick={() => toggleInlineStyle('BOLD')}>Bold</button>
      <button onClick={() => toggleInlineStyle('ITALIC')}>Italic</button>
      <button onClick={() => toggleInlineStyle('UNDERLINE')}>Underline</button>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  );
}

export default RichTextEditor;
