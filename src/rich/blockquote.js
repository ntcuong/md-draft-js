import { settings } from '~/utils/constants';
import { skip } from '~/chunks';
import { wrap, unwrap } from './wrapping';

const rtrailblankline = /(>[ \t]*)$/;
const rleadblankline = /^(>[ \t]*)/;
const rnewlinefencing = /^(\n*)([^\r]+?)(\n*)$/;
const rendtag = /^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/;
const rleadbracket = /^\n((>|\s)*)\n/;
const rtrailbracket = /\n((>|\s)*)\n$/;

export default function blockquote(chunks) {
  let match = '';
  let leftOver = '';
  let line;
  let result = Object.assign({}, chunks);

  result.selection = result.selection.replace(rnewlinefencing, newlinereplacer);
  result.before = result.before.replace(rtrailblankline, trailBlankLineReplacer);
  result.selection = result.selection.replace(/^(\s|>)+$/, '');
  result.selection = result.selection || '';

  if (result.before) {
    beforeProcessing();
  }

  result.startTag = match;
  result.before = leftOver;

  if (result.after) {
    result.after = result.after.replace(/^\n?/, '\n');
  }

  result.after = result.after.replace(rendtag, endTagReplacer);

  if (/^(?![ ]{0,3}>)/m.test(result.selection)) {
    wrap(result, settings.lineLength - 2);
    result.selection = result.selection.replace(/^/gm, '> ');

    replaceBlanksInTags(true);

    result = skip(result);
  } else {
    result.selection = result.selection.replace(/^[ ]{0,3}> ?/gm, '');

    unwrap(result);
    replaceBlanksInTags(false);

    if (!/^(\n|^)[ ]{0,3}>/.test(result.selection) && result.startTag) {
      result.startTag = result.startTag.replace(/\n{0,2}$/, '\n\n');
    }

    if (!/(\n|^)[ ]{0,3}>.*$/.test(result.selection) && result.endTag) {
      result.endTag = result.endTag.replace(/^\n{0,2}/, '\n\n');
    }
  }

  if (!/\n/.test(result.selection)) {
    result.selection = result.selection.replace(rleadblankline, leadBlankLineReplacer);
  }

  return result;

  function newlinereplacer(all, before, text, after) {
    result.before += before;
    result.after = after + result.after;

    return text;
  }

  function trailBlankLineReplacer(all, blank) {
    result.selection = blank + result.selection;

    return '';
  }

  function leadBlankLineReplacer(all, blanks) {
    result.startTag += blanks;

    return '';
  }

  function beforeProcessing() {
    const lines = result.before.replace(/\n$/, '').split('\n');
    let chained = false;
    let good;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < lines.length; i++) {
      good = false;
      line = lines[i];
      chained = chained && line.length > 0;

      if (/^>/.test(line)) {
        good = true;

        if (!chained && line.length > 1) {
          chained = true;
        }
      } else if (/^[ \t]*$/.test(line)) {
        good = true;
      } else {
        good = chained;
      }

      if (good) {
        match += `${line}\n`;
      } else {
        leftOver += match + line;
        match = '\n';
      }
    }

    if (!/(^|\n)>/.test(match)) {
      leftOver += match;
      match = '';
    }
  }

  function endTagReplacer(all) {
    result.endTag = all;

    return '';
  }

  function replaceBlanksInTags(bracket) {
    const replacement = bracket ? '> ' : '';

    if (result.startTag) {
      result.startTag = result.startTag.replace(rtrailbracket, replacer);
    }

    if (result.endTag) {
      result.endTag = result.endTag.replace(rleadbracket, replacer);
    }

    function replacer(all, markdown) {
      return `\n${markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement)}\n`;
    }
  }
}
