import isKeyCombo from 'is-key-combo';
import React, { PropTypes } from 'react';
import { commands } from '~/utils/constants';
import { getChunks } from '~/chunks';
import { setSelection } from '~/utils/selection';
import { getText } from '~/state';

class Editor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const {
      before,
      after,
      selection
    } = this.props.editorState;

    return nextProps.editorState.before !== before ||
      nextProps.editorState.after !== after ||
      nextProps.editorState.selection !== selection ||
      nextProps.className !== this.props.className;
  }

  componentDidUpdate() {
    setSelection(this.props.editorState, this.textarea);
  }

  handleKeyDown(e) {
    const prevented = this.props.commands.map(({ combo }) => combo);
    const isPrevented = prevented.some(combo => isKeyCombo(e, combo));

    if (isPrevented) {
      e.preventDefault();
    }

    this.props.commands.forEach(({ combo, command }) => {
      if (isKeyCombo(e, combo)) {
        this.props.onKeyCommand(command);
      }
    });
  }

  handleChange(e) {
    const { onChange } = this.props;
    const chunks = getChunks(e.target);

    onChange(chunks);
  }

  render() {
    const {
      name,
      editorState
    } = this.props;
    const text = getText(editorState);

    return (
      <textarea
        data-test-id="editor-text-area"
        ref={(c) => { this.textarea = c; }}
        id={name}
        name={name}
        value={text}
        className={this.props.className}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onSelect={this.handleChange}
      />
    );
  }
}

Editor.defaultProps = {
  content: '',
  name: 'content',
  onChange: () => {},
  onKeyCommand: () => {},
  commands
};

Editor.propTypes = {
  editorState: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onKeyCommand: PropTypes.func,
  commands: PropTypes.array
};

export default Editor;
