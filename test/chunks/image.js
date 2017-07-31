import { applyCommand } from '~/rich';
import { createWithContent } from '~/state';
import { expect } from 'chai';

describe('media enrichment', () => {
  it('should add an media', () => {
    const state = createWithContent({
      selection: 'foo'
    });
    const result = applyCommand(state, 'media', 'bar');

    expect(result.before).to.eql('');
    expect(result.after).to.eql('\n\n  [1]: http://bar');
    expect(result.selection).to.eql('foo');
    expect(result.startTag).to.eql('![');
    expect(result.endTag).to.eql('][1]');
  });

  it('should add an media after a link', () => {
    const state = createWithContent({
      before: '[foo][1] ',
      selection: 'bar',
      after: '\n\n  [1]: http://baz'
    });
    const result = applyCommand(state, 'media', 'quux');

    expect(result.before).to.eql('[foo][1] ');
    expect(result.after).to.eql('\n\n  [1]: http://baz\n  [2]: http://quux');
    expect(result.selection).to.eql('bar');
    expect(result.startTag).to.eql('![');
    expect(result.endTag).to.eql('][2]');
  });
});
