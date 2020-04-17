import React, { useState, useEffect, Fragment } from 'react';
import { Spinner, Colors, Divider, H1, EditableText } from '@blueprintjs/core';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useApi, Note } from '../services/api.service';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import useResizeAware from 'react-resize-aware';
import { ContentToolbar } from './ContentToolbar';

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`;

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

const Editor = styled.div`
  flex-grow: 1;
  position: relative;
`;

interface Props {
  noteId: string;
}

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

export const Content = ({ noteId }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [note, setNote] = useState<Note>();
  const [source, setSource] = useState<string>('');
  const [editorRef, setEditorRef] = useState<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const [resizeListener, sizes] = useResizeAware();
  useEffect(() => {
    console.log(sizes.width, sizes.height);
    if (editorRef) {
      editorRef.layout({ width: sizes.width, height: sizes.height - 10 });
    }
  }, [sizes.height, sizes.width, editorRef]);

  const api = useApi();
  useEffect(() => {
    setLoading(true);
    (async () => {
      const item = await api.getNoteById(noteId);
      const { body = '' } = item || {};
      setNote(item);
      setLoading(false);
      setSource(body);
    })();
  }, [noteId, api]);

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    // monaco: typeof monacoEditor,
  ) => {
    setEditorRef(editor);
    editor.layout();
    // editor.focus();
  };
  const onChange = (value: string, e: monacoEditor.editor.IModelContentChangedEvent) => {
    setSource(value);
  };

  const onTitleChange = (value: string) => {
    if (note) {
      const updatedNote = { ...note, title: value };
      setNote(updatedNote);
    }
  };

  const { title = '' } = note || {};
  return (
    <Fragment>
      {loading && (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      )}
      {!loading && (
        <PreviewContainer>
          <ContentToolbar />
          <Panels>
            <Left>
              <Title>
                <H1>
                  <EditableText
                    alwaysRenderInput={false}
                    confirmOnEnterKey={true}
                    minLines={1}
                    multiline={true}
                    onChange={onTitleChange}
                    placeholder="Edit title..."
                    selectAllOnFocus={false}
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
              <Title>
                <H1>{title}</H1>
              </Title>
              <Editor>
                <ReactMarkdown source={source} />
              </Editor>
            </Right>
          </Panels>
        </PreviewContainer>
      )}
    </Fragment>
  );
};
