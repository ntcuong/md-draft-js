const doc = global.document;

export function setSelection({ before, startTag, selection, endTag, after, scrollTop }, textarea) {
  let range;

  const start = before.length + startTag.length;
  const end = start + selection.length;

  if (textarea.selectionStart !== undefined) {
    textarea.focus();
    /* eslint-disable no-param-reassign */
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
    textarea.scrollTop = scrollTop;
    /* eslint-enable no-param-reassign */
  } else if (doc.selection) {
    if (doc.activeElement && doc.activeElement !== textarea) {
      return;
    }

    textarea.focus();
    range = textarea.createTextRange();
    range.moveStart('character', -textarea.value.length);
    range.moveEnd('character', -textarea.value.length);
    range.moveEnd('character', end);
    range.moveStart('character', start);
    range.select();
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
