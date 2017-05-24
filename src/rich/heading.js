import { skip, findTags } from '~/chunks';
import many from '~/utils/many';

export default function heading(chunks, level) {
  let calculatedLevel = level || 0;
  let result = Object.assign({}, chunks);

  result.selection = result.selection
    .replace(/\s+/g, ' ')
    .replace(/(^\s+|\s+$)/g, '');

  result = findTags(result, /#+[ ]*/, /[ ]*#+/);

  const textBefore = result.before + result.startTag;
  const currentText = textBefore.substring(textBefore.lastIndexOf('\n'));

  if (!level && /#+/.test(currentText)) {
    calculatedLevel = RegExp.lastMatch.length;
  }

  result.startTag = result.endTag = '';
  result = findTags(result, null, /\s?(-+|=+)/);

  if (!level && /=+/.test(result.endTag)) {
    calculatedLevel = 1;
  }

  if (!level && /-+/.test(result.endTag)) {
    calculatedLevel = 2;
  }

  result.startTag = result.endTag = '';
  result = skip(result, { before: 1, after: 1 });

  const levelToCreate = level || (calculatedLevel === 4 ? 1 :
    calculatedLevel + 1);

  if (levelToCreate > 0) {
    result.startTag = `${many('#', levelToCreate)} `;
  }

  return result;
}
