import parseLinkInput from 'parse-link-input';
import { trim, findTags } from '~/chunks';

const rdefinitions = /^[ ]{0,3}\[((?:attachment-)?\d+)]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm;
const rattachment = /^attachment-(\d+)$/i;

function pushDefinition({ chunks, definition, attachment }) {
  let anchor = 0;
  const regex = /(\[)((?:\[[^\]]*\]|[^[\]])*)(\][ ]?(?:\n[ ]*)?\[)((?:attachment-)?\d+)(\])/g;
  const definitions = {};
  const footnotes = [];
  const result = Object.assign({}, chunks);

  result.before = extractDefinitions(result.before);
  result.selection = extractDefinitions(result.selection);
  result.after = extractDefinitions(result.after);
  result.before = result.before.replace(regex, getLink);

  if (definition) {
    if (!attachment) {
      pushAnchor(definition);
    }
  } else {
    result.selection = result.selection.replace(regex, getLink);
  }

  const anchorNumber = anchor;

  result.after = result.after.replace(regex, getLink);

  if (result.after) {
    result.after = result.after.replace(/\n*$/, '');
  }

  if (!result.after) {
    result.selection = result.selection.replace(/\n*$/, '');
  }

  anchor = 0;
  Object.keys(definitions).forEach(pushAttachments);

  if (attachment) {
    pushAnchor(definition);
  }

  result.after += `\n\n${footnotes.join('\n')}`;

  return {
    anchor: anchorNumber,
    result
  };

  function extractDefinitions(text) {
    rdefinitions.lastIndex = 0;

    return text.replace(rdefinitions, replacer);

    function replacer(all, id, link, newlines, title) {
      definitions[id] = all.replace(/\s*$/, '');

      if (newlines) {
        definitions[id] = all.replace(/["(](.+?)[")]$/, '');
        return newlines + title;
      }

      return '';
    }
  }

  function pushAttachments(attachmentDefinition) {
    if (rattachment.test(attachmentDefinition)) {
      pushAnchor(definitions[attachmentDefinition]);
    }
  }

  function pushAnchor(anchorDefinition) {
    anchor += 1;
    // eslint-disable-next-line no-param-reassign
    anchorDefinition = anchorDefinition.replace(/^[ ]{0,3}\[(attachment-)?(\d+)]:/, `  [$1${anchor}]:`);
    footnotes.push(anchorDefinition);
  }

  function getLink(all, before, inner, afterInner, linkDefinition, end) {
    // eslint-disable-next-line no-param-reassign
    inner = inner.replace(regex, getLink);

    if (definitions[linkDefinition]) {
      pushAnchor(definitions[linkDefinition]);

      return before + inner + afterInner + anchor + end;
    }
    return all;
  }
}

export default function linkOrMediaOrAttachment(chunks, url, type) {
  const media = type === 'media';
  let result = findTags(trim(chunks), /\s*!?\[/, /][ ]?(?:\n[ ]*)?(\[.*?])?/);

  if (result.endTag.length > 1 && result.startTag.length > 0) {
    result.startTag = result.startTag.replace(/!?\[/, '');
    result.endTag = '';
    result = pushDefinition({ chunks: result }).result;

    return result;
  }

  result.selection = result.startTag + result.selection + result.endTag;
  result.startTag = result.endTag = '';

  if (/\n\n/.test(result.selection)) {
    result = pushDefinition({ chunks: result }).result;

    return result;
  }

  result.selection = (` ${result.selection}`).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, '$1\\').substr(1);
  const link = parseLinkInput(url);
  const key = link.attachment ? '  [attachment-9999]: ' : ' [9999]: ';
  const definition = key + link.href + (link.title ? ` "${link.title}"` : '');
  const definitionResult = pushDefinition({
    chunks: result,
    definition,
    attachment: link.attachment
  });
  const anchor = definitionResult.anchor;

  result = definitionResult.result;

  if (!link.attachment) {
    add();
  }

  return result;

  function add() {
    result.startTag = media ? '![' : '[';
    result.endTag = `][${anchor}]`;

    if (!result.selection) {
      result.selection = '';
    }
  }
}
