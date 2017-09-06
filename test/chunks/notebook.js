import { applyCommand } from '~/rich';
import { createWithContent } from '~/state';
import { expect } from 'chai';

describe('notebook enrichment', () => {
  it('should apply notebook block', () => {
    const state = createWithContent({
      before: 'foo\n',
      selection: '',
      after: '\nbaz'
    });
    const result = applyCommand(state, 'notebook');

    expect(result.startTag).to.eql('```notebook\n');
    expect(result.endTag).to.eql('\n```');
    expect(result.before).to.eql('foo\n\n');
    expect(result.selection).to.eql('');
    expect(result.after).to.eql('\n\nbaz');
  });

  it('should remove notebook block', () => {
    const state = createWithContent({
      before: 'foo\n```notebook\n',
      selection: '',
      after: '\n```\nquux'
    });
    const result = applyCommand(state, 'notebook');

    expect(result.startTag).to.eql('');
    expect(result.endTag).to.eql('');
    expect(result.before).to.eql('foo\n');
    expect(result.selection).to.eql('');
    expect(result.after).to.eql('\nquux');
  });
});
