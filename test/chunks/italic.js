import { applyCommand } from '~/rich';
import { createEmpty } from '~/state';
import { expect } from 'chai';

describe('italic enrichment', () => {
  it('should apply italic', () => {
    const state = createEmpty({
      before: 'foo ',
      selection: 'bar',
      after: ' baz'
    });
    const result = applyCommand(state, 'italic');

    expect(result.before).to.eql('foo _');
    expect(result.selection).to.eql('bar');
    expect(result.after).to.eql('_ baz');
  });

  it('should remove italic', () => {
    const state = createEmpty({
      before: 'foo _',
      selection: 'bar',
      after: '_ baz'
    });
    const result = applyCommand(state, 'italic');

    expect(result.before).to.eql('foo ');
    expect(result.selection).to.eql('bar');
    expect(result.after).to.eql(' baz');
  });
});
