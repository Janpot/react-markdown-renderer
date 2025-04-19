import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, Document, Paragraph, Strong, Emphasis } from '../src';

describe('Text Node Handling', () => {
  it('groups adjacent text and inline elements in top-level Document', () => {
    const markdown = render(
      <Document>
        This is a text node followed by <Strong>bold text</Strong> and more
        plain text with <Emphasis>emphasized text</Emphasis> all in one
        paragraph.
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "This is a text node followed by **bold text** and more plain text with *emphasized text* all in one paragraph.
      "
    `);
  });

  it('properly handles text with whitespace', () => {
    const markdown = render(
      <Document>
        Text with multiple spaces and line breaks should be preserved in a
        reasonable way.
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "Text with multiple spaces and line breaks should be preserved in a reasonable way.
      "
    `);
  });

  it('separates multiple text blocks with block elements between them', () => {
    const markdown = render(
      <Document>
        This is the first paragraph.
        <Paragraph>This is an explicit paragraph.</Paragraph>
        This is a third paragraph that should be separate.
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "This is the first paragraph.

      This is an explicit paragraph.

      This is a third paragraph that should be separate.
      "
    `);
  });
});
