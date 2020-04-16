import React, { useState, useEffect, Fragment } from 'react';
import { Spinner, Colors, Divider } from '@blueprintjs/core';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useApi, Note } from '../services/api.service';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import useResizeAware from 'react-resize-aware';

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`;

const PreviewContainer = styled.div`
  color: ${Colors.DARK_GRAY5};
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  padding: 5px;
`;

const Left = styled.div`
  flex: 1 1 50%;
  margin: 5px;
`;
const Right = styled.div`
  flex: 1 1 50%;
  margin: 5px 5px 5px 20px;
  overflow-y: scroll;
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
  const [, setNote] = useState<Note>();
  const [source, setSource] = useState<string>('');
  const [editorRef, setEditorRef] = useState<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const [resizeListener, sizes] = useResizeAware();
  useEffect(() => {
    if (editorRef) {
      editorRef.layout();
    }
  }, [sizes.height, editorRef]);

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
    // editor.focus();
  };
  const onChange = (value: string, e: monacoEditor.editor.IModelContentChangedEvent) => {
    setSource(value);
  };

  return (
    <Fragment>
      {loading && (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      )}
      {!loading && (
        <PreviewContainer>
          <Left>
            {resizeListener}
            <MonacoEditor
              width="100%"
              height="100%"
              language="markdown"
              theme="myTheme"
              value={source}
              options={options}
              onChange={onChange}
              editorDidMount={editorDidMount}
            />
          </Left>
          <Divider />
          <Right>
            <ReactMarkdown source={source} />
          </Right>
        </PreviewContainer>
      )}
    </Fragment>
  );
};
