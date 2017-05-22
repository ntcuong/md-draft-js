import React from 'react';
import { Editor, EditorState, RichUtils } from '../src';

const content = '# Sample content\nYour content goes here.';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
    }
  }

  onBoldClick() {
    this.onChange(RichUtils.handleKeyCommand(this.state.editorState, 'bold'));
  }

  onItalicClick() {
    this.onChange(RichUtils.handleKeyCommand(this.state.editorState, 'italic'));
  }

  onHeadingClick() {
    this.onChange(RichUtils.handleKeyCommand(this.state.editorState, 'heading'));
  }

  render() {
    return (
      <div>
        <button onClick={this.onBoldClick.bind(this)}>Bold</button>
        <button onClick={this.onItalicClick.bind(this)}>Italic</button>
        <button onClick={this.onHeadingClick.bind(this)}>Heading</button>
        <Editor
          editorState={this.state.editorState}
          onKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default MyEditor;
