import { applyCommand } from '~/rich';
import { createEmpty } from '~/state';
import { expect } from 'chai';

describe('image enrichment', () => {
  it('should add an image', () => {
    const state = createEmpty({
      selection: 'foo'
    });
    const result = applyCommand(state, 'image', 'bar');

    expect(result.before).to.eql('');
    expect(result.after).to.eql('\n\n  [1]: http://bar');
    expect(result.selection).to.eql('foo');
    expect(result.startTag).to.eql('![');
    expect(result.endTag).to.eql('][1]');
  });

  it('should add an image after a link', () => {
    const state = createEmpty({
      before: '[foo][1] ',
      selection: 'bar',
      after: '\n\n  [1]: http://baz'
    });
    const result = applyCommand(state, 'image', 'quux');

    expect(result.before).to.eql('[foo][1] ');
    expect(result.after).to.eql('\n\n  [1]: http://baz\n  [2]: http://quux');
    expect(result.selection).to.eql('bar');
    expect(result.startTag).to.eql('![');
    expect(result.endTag).to.eql('][2]');
  });
});
