import many from '~/utils/many';
import { skip, trim, findTags } from '~/chunks';
import { settings } from '~/utils/constants';
import { wrap, unwrap } from './wrapping';

const rprevious = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
const rnext = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;
const rbullettype = /^\s*([*+-])/;
const rskipper = /[^\n]\n\n[^\n]/;

function pad(text) {
  return ` ${text} `;
}

export default function list(chunks, ordered) {
  let bullet = '-';
  let num = 0;
  let digital;
  let beforeSkip = 1;
  let afterSkip = 1;
  let result = findTags(chunks, /(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/);

  if (result.before && !/\n$/.test(result.before) && !/^\n/.test(result.startTag)) {
    result.before += result.startTag;
    result.startTag = '';
  }

  if (result.startTag) {
    digital = /\d+[.]/.test(result.startTag);
    result.startTag = '';
    result.selection = result.selection.replace(/\n[ ]{4}/g, '\n');
    result = unwrap(result);
    result = skip(result);

    if (digital) {
      result.after = result.after.replace(rnext, getPrefixedItem);
    }

    if (ordered === digital) {
      return result;
    }
  }

  result.before = result.before.replace(rprevious, beforeReplacer);

  if (!result.selection) {
    result.selection = '';
  }

  const prefix = nextBullet();
  const spaces = many(' ', prefix.length);

  result.after = result.after.replace(rnext, afterReplacer);
  result = trim(result, true);
  result = skip(result, { before: beforeSkip, after: afterSkip, any: true });
  result.startTag = prefix;
  result = wrap(result, settings.lineLength - prefix.length);
  result.selection = result.selection.replace(/\n/g, `\n${spaces}`);

  return result;

  function beforeReplacer(text) {
    if (rbullettype.test(text)) {
      bullet = RegExp.$1;
    }

    beforeSkip = rskipper.test(text) ? 1 : 0;

    return getPrefixedItem(text);
  }

  function afterReplacer(text) {
    afterSkip = rskipper.test(text) ? 1 : 0;

    return getPrefixedItem(text);
  }

  function nextBullet() {
    if (ordered) {
      num += 1;
      return pad(`${num}.`);
    }

    return pad(bullet);
  }

  function getPrefixedItem(text) {
    const rmarkers = /^[ ]{0,3}([*+-]|\d+[.])\s/gm;
    return text.replace(rmarkers, nextBullet);
  }
}
