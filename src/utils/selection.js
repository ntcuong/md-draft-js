export function setSelection({ before, startTag, selection, endTag, after, scrollTop, focus }, textarea) {
  const start = before.length + startTag.length;
  const end = start + selection.length;

  if (textarea.selectionStart !== undefined) {
    if (focus) {
      textarea.focus();
    }
    /* eslint-disable no-param-reassign */
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
    textarea.scrollTop = scrollTop;
    /* eslint-enable no-param-reassign */
  }
}

export function getSelection(textarea) {
  if (textarea.selectionStart !== undefined) {
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    };
  }

  return {
    start: 0,
    end: 0
  };
}
