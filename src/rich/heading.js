import { skip, findTags } from '~/chunks';
import many from '~/utils/many';

export default function heading(chunks) {
  let level = 0;
  let result = Object.assign({}, chunks);

  result.selection = result.selection
    .replace(/\s+/g, ' ')
    .replace(/(^\s+|\s+$)/g, '');

  result = findTags(result, /#+[ ]*/, /[ ]*#+/);

  const textBefore = result.before + result.startTag;
  const currentText = textBefore.substring(textBefore.lastIndexOf('\n'));

  if (/#+/.test(currentText)) {
    level = RegExp.lastMatch.length;
  }

  result.startTag = result.endTag = '';
  result = findTags(result, null, /\s?(-+|=+)/);

  if (/=+/.test(result.endTag)) {
    level = 1;
  }

  if (/-+/.test(result.endTag)) {
    level = 2;
  }

  result.startTag = result.endTag = '';
  result = skip(result, { before: 1, after: 1 });

  const levelToCreate = level === 4 ? 1 :
    level + 1;

  if (levelToCreate > 0) {
    result.startTag = `${many('#', levelToCreate)} `;
  }

  return result;
}
