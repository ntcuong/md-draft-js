import isKeyCombo from 'is-key-combo';
import React from 'react';
import PropTypes from 'prop-types';
import { commands } from '~/utils/constants';
import { getChunks } from '~/chunks';
import { setSelection } from '~/utils/selection';
import { getText } from '~/state';

export default class Editor extends React.PureComponent {
  static defaultProps = {
    content: '',
    name: 'content',
    onChange: () => {},
    onKeyCommand: () => {},
    commands
  };

  static propTypes = {
    autoFocus: PropTypes.bool,
    editorState: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onKeyCommand: PropTypes.func,
    commands: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const props = [
      'before',
      'after',
      'startTag',
      'endTag',
      'selection'
    ];

    return nextProps.className !== this.props.className ||
      props.some(prop => nextProps.editorState[prop] !== this.props[prop]);
  }

  componentDidUpdate() {
    setSelection(this.props.editorState, this.textarea);
  }

  handleKeyDown(e) {
    this.props.commands.forEach((command) => {
      if (isKeyCombo(e, command.combo)) {
        e.preventDefault();
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
      autoFocus,
      name,
      editorState
    } = this.props;
    const text = getText(editorState);

    return (
      <textarea
        data-test-id="editor-text-area"
        autoFocus={autoFocus}
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
