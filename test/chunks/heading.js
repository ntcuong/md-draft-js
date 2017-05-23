import { applyCommand } from '~/rich';
import { createEmpty } from '~/state';
import { expect } from 'chai';

describe('bold enrichment', () => {
  it('should create an h1 after text', () => {
    const state = createEmpty('foo');
    const result = applyCommand(state, 'heading');

    expect(result.before).to.eql('foo\n\n');
    expect(result.startTag).to.eql('# ');
    expect(result.after).to.eql('');
  });

  it('should create an h1 for selected text', () => {
    const state = createEmpty({
      selection: 'foo'
    });
    const result = applyCommand(state, 'heading');

    expect(result.selection).to.eql('foo');
    expect(result.startTag).to.eql('# ');
  });

  it('should create an h2 for selected text', () => {
    const state = createEmpty({
      before: '# ',
      selection: 'foo'
    });
    const result = applyCommand(state, 'heading');

    expect(result.selection).to.eql('foo');
    expect(result.startTag).to.eql('## ');
  });

  it('should create an h1 when selected text is h4', () => {
    const state = createEmpty({
      before: '#### ',
      selection: 'foo'
    });
    const result = applyCommand(state, 'heading');

    expect(result.selection).to.eql('foo');
    expect(result.startTag).to.eql('# ');
  });

  it('should create an h1 when having an h1 before', () => {
    const state = createEmpty({
      before: '# title1\n\n',
      selection: 'foo'
    });
    const result = applyCommand(state, 'heading');

    expect(result.before).to.eql('# title1\n\n');
    expect(result.selection).to.eql('foo');
    expect(result.startTag).to.eql('# ');
  });

  it('should create an h1 when having an h1 and text before', () => {
    const state = createEmpty({
      before: 'asd\n\n# title1\n\n',
      selection: 'foo'
    });
    const result = applyCommand(state, 'heading');

    expect(result.before).to.eql('asd\n\n# title1\n\n');
    expect(result.selection).to.eql('foo');
    expect(result.startTag).to.eql('# ');
  });
});
