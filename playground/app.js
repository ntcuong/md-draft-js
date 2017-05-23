import classNames from 'classnames';
import React from 'react';
import { Editor, EditorState, RichUtils } from '../src';
import { isBold } from '~/rich/bold';
import { isItalic } from '~/rich/italic';

const content = '# Sample title\n\nYour content goes here.';

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createEmpty(content) };
    this.onChange = (editorState) => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command) {
    const newState = RichUtils.applyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
    }
  }

  onBoldClick() {
    this.onChange(RichUtils.applyCommand(this.state.editorState, 'bold'));
  }

  onItalicClick() {
    this.onChange(RichUtils.applyCommand(this.state.editorState, 'italic'));
  }

  onHeadingClick() {
    this.onChange(RichUtils.applyCommand(this.state.editorState, 'heading'));
  }

  onQuoteClick() {
    this.onChange(RichUtils.applyCommand(this.state.editorState, 'quote'));
  }

  onMonospaceClick() {
    this.onChange(RichUtils.applyCommand(this.state.editorState, 'code'));
  }

  onListClick() {
    this.onChange(RichUtils.applyCommand(this.state.editorState, 'ul'));
  }

  onLinkClick() {
    const link = global.prompt('Link URL:');

    if (link) {
      this.onChange(RichUtils.applyCommand(this.state.editorState, 'link', link));
    }
  }

  onImageClick() {
    const image = global.prompt('Image URL:');

    if (image) {
      this.onChange(RichUtils.applyCommand(this.state.editorState, 'image', image));
    }
  }

  render() {
    return (
      <div className="editor">
        <div className="editor-buttons">
          <button
            className={classNames('editor-action', isBold(this.state.editorState) ? 'active' : '')}
            onClick={this.onBoldClick.bind(this)}
            aria-label="Bold"
          >
            <span
              className="glyphicon glyphicon-bold"
              aria-hidden="true"
            />
          </button>
          <button
            className={classNames('editor-action', isItalic(this.state.editorState) ? 'active' : '')}
            onClick={this.onItalicClick.bind(this)}
            aria-label="Italic">
            <span
              className="glyphicon glyphicon-italic"
              aria-hidden="true"
            />
          </button>
          <button
            className="editor-action"
            onClick={this.onHeadingClick.bind(this)}
            aria-label="Heading"
          >
            <span
              className="glyphicon glyphicon-header"
              aria-hidden="true"
            />
          </button>
          <button
            className="editor-action"
            onClick={this.onQuoteClick.bind(this)}
            aria-label="Quote"
          >
            <span
              className="glyphicon glyphicon-comment"
              aria-hidden="true"
            />
          </button>
          <button
            className="editor-action"
            onClick={this.onMonospaceClick.bind(this)}
            aria-label="Monospace"
          >
            <span
              className="glyphicon glyphicon-console"
              aria-hidden="true"
            />
          </button>
          <button
            className="editor-action"
            onClick={this.onListClick.bind(this)}
            aria-label="List"
          >
            <span
              className="glyphicon glyphicon-list"
              aria-hidden="true"
            />
          </button>
          <button
            className="editor-action"
            onClick={this.onLinkClick.bind(this)}
            aria-label="Link"
          >
            <span
              className="glyphicon glyphicon-link"
              aria-hidden="true"
            />
          </button>
          <button
            className="editor-action"
            onClick={this.onImageClick.bind(this)}
            aria-label="Image"
          >
            <span
              className="glyphicon glyphicon-picture"
              aria-hidden="true"
            />
          </button>
        </div>
        <Editor
          autoFocus
          className="editor-textarea"
          editorState={this.state.editorState}
          onKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
