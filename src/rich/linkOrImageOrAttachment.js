/* eslint-disable */
import { placeholders } from '~/utils/constants';
import parseLinkInput from '~/utils/parseLinkInput';
import once from '~/utils/once';

const rdefinitions = /^[ ]{0,3}\[((?:attachment-)?\d+)]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm;
const rattachment = /^attachment-(\d+)$/i;

function extractDefinitions(text, definitions) {
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

function pushDefinition(options) {
  const chunks = options.chunks;
  const definition = options.definition;
  const attachment = options.attachment;
  const regex = /(\[)((?:\[[^\]]*]|[^[]])*)(][ ]?(?:\n[ ]*)?\[)((?:attachment-)?\d+)(])/g;
  let anchor = 0;
  const definitions = {};
  const footnotes = [];

  chunks.before = extractDefinitions(chunks.before, definitions);
  chunks.selection = extractDefinitions(chunks.selection, definitions);
  chunks.after = extractDefinitions(chunks.after, definitions);
  chunks.before = chunks.before.replace(regex, getLink);

  if (definition) {
    if (!attachment) { pushAnchor(definition); }
  } else {
    chunks.selection = chunks.selection.replace(regex, getLink);
  }

  const result = anchor;

  chunks.after = chunks.after.replace(regex, getLink);

  if (chunks.after) {
    chunks.after = chunks.after.replace(/\n*$/, '');
  }
  if (!chunks.after) {
    chunks.selection = chunks.selection.replace(/\n*$/, '');
  }

  anchor = 0;
  Object.keys(definitions).forEach(pushAttachments);

  if (attachment) {
    pushAnchor(definition);
  }
  chunks.after += `\n\n${footnotes.join('\n')}`;

  return result;

  function pushAttachments(attachmentDefinition) {
    if (rattachment.test(attachmentDefinition)) {
      pushAnchor(definitions[attachmentDefinition]);
    }
  }

  function pushAnchor(anchorDefinition) {
    anchor += 1;
    anchorDefinition = anchorDefinition.replace(/^[ ]{0,3}\[(attachment-)?(\d+)]:/, `  [$1${anchor}]:`);
    footnotes.push(anchorDefinition);
  }

  function getLink(all, before, inner, afterInner, linkDefinition, end) {
    inner = inner.replace(regex, getLink);
    if (definitions[linkDefinition]) {
      pushAnchor(definitions[linkDefinition]);
      return before + inner + afterInner + anchor + end;
    }
    return all;
  }
}

function linkOrImageOrAttachment(chunks, options) {
  const type = options.type;
  const image = type === 'image';
  const resume = this.async();

  chunks.trim();
  chunks.findTags(/\s*!?\[/, /][ ]?(?:\n[ ]*)?(\[.*?])?/);

  if (chunks.endTag.length > 1 && chunks.startTag.length > 0) {
    chunks.startTag = chunks.startTag.replace(/!?\[/, '');
    chunks.endTag = '';
    pushDefinition({ chunks });
    return;
  }

  chunks.selection = chunks.startTag + chunks.selection + chunks.endTag;
  chunks.startTag = chunks.endTag = '';

  if (/\n\n/.test(chunks.selection)) {
    pushDefinition({ chunks });
    return;
  }

  options.prompts.close();
  (options.prompts[type] || options.prompts.link)(options, once(resolved));

  function resolved(result) {
    const links = result
      .definitions
      .map(parseLinkInput)
      .filter(long);

    links.forEach(renderLink);
    resume();

    function renderLink(link, i) {
      chunks.selection = (` ${chunks.selection}`).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, '$1\\').substr(1);

      const key = result.attachment ? '  [attachment-9999]: ' : ' [9999]: ';
      const definition = key + link.href + (link.title ? ` "${link.title}"` : '');
      const anchor = pushDefinition({
        chunks,
        definition,
        attachment: result.attachment
      });

      if (!result.attachment) {
        add();
      }

      function add() {
        chunks.startTag = image ? '![' : '[';
        chunks.endTag = `][${anchor}]`;

        if (!chunks.selection) {
          chunks.selection = placeholders[type];
        }

        if (i < links.length - 1) { // has multiple links, not the last one
          chunks.before += `${chunks.startTag + chunks.selection + chunks.endTag}\n`;
        }
      }
    }

    function long(link) {
      return link.href.length > 0;
    }
  }
}

module.exports = linkOrImageOrAttachment;
/* eslint-enable */
