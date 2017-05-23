import { trim } from '~/chunks';

export default function bold(chunks) {
  const rleading = /^(\**)/;
  const rtrailing = /(\**$)/;
  const rtrailingspace = /(\s?)$/;
  const rnewlines = /\n{2,}/g;

  const result = trim(chunks);

  result.selection = result.selection.replace(rnewlines, '\n');

  const leadStars = rtrailing.exec(result.before)[0];
  const trailStars = rleading.exec(result.after)[0];
  const stars = '\\*{2}';
  const fence = Math.min(leadStars.length, trailStars.length);

  if (fence >= 2) {
    result.before = result.before.replace(new RegExp(`${stars}$`, ''), '');
    result.after = result.after.replace(new RegExp(`^${stars}`, ''), '');
  } else if (!result.selection && trailStars) {
    result.after = result.after.replace(rleading, '');
    result.before = result.before.replace(rtrailingspace, '') + trailStars + RegExp.$1;
  } else {
    if (!result.selection && !trailStars) {
      result.selection = '';
    }

    const markup = '**';
    result.before += markup;
    result.after = markup + result.after;
  }

  return result;
}

export function isBold(chunks) {
  const rleading = /^(\**)/;
  const rtrailing = /(\**$)/;
  const rnewlines = /\n{2,}/g;
  const result = trim(chunks);
  const leadStars = rtrailing.exec(result.before)[0];
  const trailStars = rleading.exec(result.after)[0];
  const fence = Math.min(leadStars.length, trailStars.length);

  return fence >= 2 || (!result.selection.replace(rnewlines, '\n') && trailStars);
}
