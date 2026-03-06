import { describe, it, expect } from 'vitest';
import { markdownToHtml, escapeHtml } from './markdown';

describe('markdownToHtml', () => {
  it('converts h2 headings', () => {
    expect(markdownToHtml('## Hello')).toContain('<h2>Hello</h2>');
  });

  it('converts bold text', () => {
    expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>');
  });

  it('converts unordered lists', () => {
    const result = markdownToHtml('- item one\n- item two');
    expect(result).toContain('<li>item one</li>');
    expect(result).toContain('<ul>');
  });

  it('wraps plain text in paragraphs', () => {
    expect(markdownToHtml('plain text')).toContain('<p>plain text</p>');
  });
});

describe('escapeHtml', () => {
  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });
});
