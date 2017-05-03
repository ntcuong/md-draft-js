import { skip } from '~/chunks';

export default function hr(chunks) {
  const result = Object.assign({}, chunks);

  result.startTag = '----------\n';
  result.selection = '';

  return skip(result, { left: 2, right: 1, any: true });
}
