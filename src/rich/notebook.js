import { skip } from '~/chunks';

const rtextbefore = /\S[ ]*$/;
const rtextafter = /^[ ]*\S/;
const rnewline = /\n/;
const rfencebefore = /```notebook\n$/;
const rfencebeforeinside = /^```notebook\n/;
const rfenceafter = /^\n?```/;
const rfenceafterinside = /\n```$/;

export default function notebook(chunks, metadata) {
  const newlined = rnewline.test(chunks.selection);
  const trailing = rtextafter.test(chunks.after);
  const leading = rtextbefore.test(chunks.before);
  const outfenced = rfencebefore.test(chunks.before) && rfenceafter.test(chunks.after);

  if (outfenced || newlined || !(leading || trailing)) {
    return block(chunks, outfenced, metadata);
  }

  return Object.assign({}, chunks, { startTag: '\n```notebook\n', endTag: '```\n' });
}

function block(chunks, outfenced, metadata) {
  let result = Object.assign({}, chunks);

  if (outfenced) {
    result.before = result.before.replace(rfencebefore, '');
    result.after = result.after.replace(rfenceafter, '');

    return result;
  }

  result.before = result.before.replace(/[ ]{4}|```[a-z]*\n$/, mergeSelection);
  result = skip(result, {
    before: /(\n|^)(\t|[ ]{4,}|```[a-z]*\n).*\n$/.test(result.before) ? 0 : 1,
    after: /^\n(\t|[ ]{4,}|\n```)/.test(result.after) ? 0 : 1
  });

  if (!result.selection) {
    result.startTag = '```notebook\n';
    result.endTag = '\n```';
    result.selection = metadata || '';
  } else if (rfencebeforeinside.test(result.selection) && rfenceafterinside.test(result.selection)) {
    result.selection = result.selection.replace(/(^```[a-z]*\n)|(```$)/g, '');
  } else if (/^[ ]{0,3}\S/m.test(result.selection)) {
    result.before += '```notebook\n';
    result.after = `\n\`\`\`${result.after}`;
  } else {
    result.selection = result.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t|```[a-z]*)/gm, '');
  }

  return result;

  function mergeSelection(all) {
    result.selection = all + result.selection;

    return '';
  }
}
