import React, { useState, useEffect } from 'react';
import { Colors, Divider, H1, EditableText } from '@blueprintjs/core';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import useResizeAware from 'react-resize-aware';
import { ContentToolbar } from './ContentToolbar';

const PreviewContainer = styled.div`
  color: ${Colors.DARK_GRAY5};
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  padding: 0;
`;

const Panels = styled.div`
  color: ${Colors.DARK_GRAY5};
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
`;

const Left = styled.div`
  flex: 1 1 50%;
  margin: 0 5px;
  height: 100%;
  display: flex;
  flex-flow: column;
`;
const Right = styled.div`
  flex: 1 0 50%;
  margin: 5px 5px 5px 20px;
  overflow-y: scroll;
`;

const Title = styled.div`
  padding-top: 10px;
  .bp3-heading {
    color: ${Colors.GRAY1};
    padding-left: 10px;
  }
  .bp3-heading .bp3-editable-text-input {
    background-color: ${Colors.LIGHT_GRAY1};
  }
`;

const TitleRight = styled(Title)`
  .bp3-heading {
    color: ${Colors.GRAY1};
    padding-left: 0;
  }
`;

const Editor = styled.div`
  flex-grow: 1;
  position: relative;
`;

const options: monacoEditor.editor.IEditorConstructionOptions = {
  selectOnLineNumbers: true,
  minimap: {
    enabled: false,
  },
  lineNumbers: 'off',
  scrollbar: {
    vertical: 'hidden',
  },
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  automaticLayout: true,
};

const theme: monacoEditor.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': Colors.LIGHT_GRAY1,
  },
};

monacoEditor.editor.defineTheme('myTheme', theme);

interface Props {
  body: string;
  dirty?: boolean;
  loading: boolean;
  onBodyChange?: (body: string) => void;
  onCancel: () => void;
  onSave: (title: string, body: string) => void;
  onTitleChange?: (title: string) => void;
  title: string;
}
export const Content = ({
  title: initialTitle,
  body: initialSource,
  dirty: initialDirty,
  loading,
  onTitleChange,
  onBodyChange,
  onSave,
  onCancel,
}: Props) => {
  const [editorRef, setEditorRef] = useState<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const [resizeListener, sizes] = useResizeAware();
  useEffect(() => {
    if (editorRef) {
      editorRef.layout({ width: sizes.width, height: sizes.height - 10 });
    }
  }, [sizes.height, sizes.width, editorRef]);
  useEffect(() => {
    if (editorRef) {
      editorRef.updateOptions({
        readOnly: loading,
      });
    }
  }, [editorRef, loading]);

  const [title, setTitle] = useState<string>(initialTitle);
  const [source, setSource] = useState<string>(initialSource);
  const [dirty, setDirty] = useState<boolean>(initialDirty || false);
  useEffect(() => {
    const hasChanges = initialDirty || initialTitle !== title || initialSource !== source;
    setDirty(hasChanges);
  }, [initialTitle, title, initialSource, source, initialDirty]);
  useEffect(() => {
    setSource(initialSource);
  }, [initialSource]);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    // monaco: typeof monacoEditor,
  ) => {
    setEditorRef(editor);
    editor.layout();
    editor.focus();
  };

  const onChange = (value: string, e: monacoEditor.editor.IModelContentChangedEvent) => {
    setSource(value);
    if (onBodyChange) {
      onBodyChange(value);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (onTitleChange) {
      onTitleChange(value);
    }
  };

  const handleSave = () => {
    onSave(title, source);
  };

  return (
    <PreviewContainer>
      <ContentToolbar dirty={dirty} onSaveClick={handleSave} onCancelClick={onCancel} />
      <Panels>
        <Left>
          <Title>
            <H1>
              <EditableText
                alwaysRenderInput={false}
                confirmOnEnterKey={true}
                minLines={1}
                multiline={true}
                onChange={handleTitleChange}
                placeholder="Edit title..."
                selectAllOnFocus={true}
                value={title}
              />
            </H1>
          </Title>
          <Editor>
            {resizeListener}
            <MonacoEditor
              language="markdown"
              theme="myTheme"
              value={source}
              options={options}
              onChange={onChange}
              editorDidMount={editorDidMount}
            />
          </Editor>
        </Left>
        <Divider />
        <Right>
          <TitleRight>
            <H1>{title}</H1>
          </TitleRight>
          <Editor>
            <ReactMarkdown source={source} />
          </Editor>
        </Right>
      </Panels>
    </PreviewContainer>
  );
};
