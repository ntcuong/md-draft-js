const rinput = /^\s*(.*?)(?:\s+"(.+)")?\s*$/;
const rfull = /^(?:https?|ftp):\/\//;

function queryUnencodedReplacer(query) {
  return query.replace(/\+/g, ' ');
}

function queryEncodedReplacer(query) {
  return query.replace(/\+/g, '%2b');
}

function formatTitle(title) {
  if (!title) {
    return null;
  }

  return title
    .replace(/^\s+|\s+$/g, '')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatHref(url) {
  const href = url.replace(/^\s+|\s+$/g, '');
  if (href.length && href[0] !== '/' && !rfull.test(href)) {
    return `http://${href}`;
  }
  return href;
}

export default function parseLinkInput(input) {
  return parser(...input.match(rinput));

  function parser(all, link, title) {
    let href = link.replace(/\?.*$/, queryUnencodedReplacer);
    href = decodeURIComponent(href);
    href = encodeURI(href).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
    href = href.replace(/\?.*$/, queryEncodedReplacer);

    return {
      href: formatHref(href), title: formatTitle(title)
    };
  }
}
