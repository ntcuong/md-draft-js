export function createEmpty(text = '') {
  return {
    before: '',
    after: text,
    selection: '',
    startTag: '',
    endTag: '',
    scrollTop: 0,
    start: 0,
    end: 0,
    text
  };
}

export function getText(state) {
  return state.before +
    state.startTag +
    state.selection +
    state.endTag +
    state.after;
}
