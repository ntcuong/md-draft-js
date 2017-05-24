import { applyCommand } from '~/rich';
import { createEmpty } from '~/state';
import { expect } from 'chai';

describe('bold enrichment', () => {
  it('should apply bold', () => {
    const state = createEmpty({
      before: 'foo ',
      selection: 'bar',
      after: ' baz'
    });
    const result = applyCommand(state, 'bold');

    expect(result.before).to.eql('foo **');
    expect(result.selection).to.eql('bar');
    expect(result.after).to.eql('** baz');
  });

  it('should remove bold', () => {
    const state = createEmpty({
      before: 'foo **',
      selection: 'bar',
      after: '** baz'
    });
    const result = applyCommand(state, 'bold');

    expect(result.before).to.eql('foo ');
    expect(result.selection).to.eql('bar');
    expect(result.after).to.eql(' baz');
  });
});
