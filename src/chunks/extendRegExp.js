export default function extendRegExp(regex, pre, post) {
  let pattern = regex.toString();
  let flags;

  pattern = pattern.replace(/\/([gim]*)$/, captureFlags);
  pattern = pattern.replace(/(^\/|\/$)/g, '');
  pattern = pre + pattern + post;
  return new RegExp(pattern, flags);

  function captureFlags(all, f) {
    flags = f;
    return '';
  }
}
