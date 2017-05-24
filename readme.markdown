# Markdown draft.js

Markdown editor framework based on <a href="https://draftjs.org">Draft.js</a> that works with an immutable state and utility functions to modify it.

Live demo [here](http://mulesoft-labs.github.io/md-draft-js)!

## Install

Use it as an npm package:

```shell
npm install md-draft-js --save
```

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'md-draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty('Your initial content') };
    this.onChange = (editorState) => this.setState({ editorState });
  }

  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('container')
);
```

[dejavú?](https://draftjs.org/docs/overview.html#content)

## Handling keys

```jsx
// ...
import { Editor, EditorState, RichUtils } from 'md-draft-js';

class MyEditor extends React.Component {
  /// ...

  handleKeyCommand(command) {
    const newState = RichUtils.applyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
    }
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        onKeyCommand={this.handleKeyCommand}
      />
    );
  }
}
```

## Applying a style

```jsx
// ...
import { Editor, EditorState, RichUtils } from 'md-draft-js';

class MyEditor extends React.Component {
  /// ...

  handleBoldClick() {
    const newState = RichUtils.applyCommand(this.state.editorState, 'bold');

    this.onChange(newState);
  }

  render() {
    return (
      <button onClick={this.handleBoldClick}>Bold</button>
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}
```

## Fully working example

See [this file](https://github.com/mulesoft-labs/md-draft-js/blob/master/playground/app.js) to check a fully working example.

## License

MIT
