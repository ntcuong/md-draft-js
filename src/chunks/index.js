import many from '~/utils/many';
import fixEOL from '~/utils/fixEOL';
import { getSelection } from '~/utils/selection';
import extendRegExp from './extendRegExp';

export function getChunks(textarea) {
  const selectionInfo = getSelection(textarea);
  const before = fixEOL(textarea.value.substring(0, selectionInfo.start));
  const selection = fixEOL(textarea.value.substring(selectionInfo.start, selectionInfo.end));
  const after = fixEOL(textarea.value.substring(selectionInfo.end));

  return {
    before,
    after,
    selection,
    startTag: '',
    endTag: '',
    scrollTop: textarea.scrollTop,
    text: textarea.value,
    focus: false
  };
}

export function findTags(state, startRegex, endRegex) {
  let regex;
  const result = Object.assign({}, state);

  if (startRegex) {
    regex = extendRegExp(startRegex, '', '$');
    result.before = result.before.replace(regex, startReplacer);
    regex = extendRegExp(startRegex, '^', '');
    result.selection = result.selection.replace(regex, startReplacer);
  }

  if (endRegex) {
    regex = extendRegExp(endRegex, '', '$');
    result.selection = result.selection.replace(regex, endReplacer);
    regex = extendRegExp(endRegex, '^', '');
    result.after = result.after.replace(regex, endReplacer);
  }

  return result;

  function startReplacer(match) {
    result.startTag += match;

    return '';
  }

  function endReplacer(match) {
    result.endTag = match + result.endTag;

    return '';
  }
}

export function skip(state, options) {
  const o = options || {};
  const result = Object.assign({}, state);
  let beforeCount = 'before' in o ? o.before : 1;
  let afterCount = 'after' in o ? o.after : 1;

  result.selection = result.selection.replace(/(^\n*)/, '');
  result.startTag += RegExp.$1;
  result.selection = result.selection.replace(/(\n*$)/, '');
  result.endTag += RegExp.$1;
  result.startTag = result.startTag.replace(/(^\n*)/, '');
  result.before += RegExp.$1;
  result.endTag = result.endTag.replace(/(\n*$)/, '');
  result.after += RegExp.$1;

  if (result.before) {
    beforeCount += 1;
    result.before = replace(result.before, beforeCount, '$');
  }

  if (result.after) {
    afterCount += 1;
    result.after = replace(result.after, afterCount, '');
  }

  return result;

  function replace(text, count, suffix) {
    const regex = o.any ? '\\n*' : many('\\n?', count);
    const replacement = many('\n', count);

    return text.replace(new RegExp(regex + suffix), replacement);
  }
}

export function trim(state, remove) {
  const result = Object.assign({}, state);

  result.selection = result.selection
    .replace(/^(\s*)/, remove ? '' : beforeReplacer)
    .replace(/(\s*)$/, remove ? '' : afterReplacer);

  return result;

  function beforeReplacer(text) {
    result.before += text; return '';
  }

  function afterReplacer(text) {
    result.after = text + result.after; return '';
  }
}
