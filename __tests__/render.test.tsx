import { describe, it, expect } from 'vitest';
import React from 'react';
import {
  render,
  Document,
  Header,
  Paragraph,
  Strong,
  Link,
  List,
  ListItem,
  Code,
  Image,
  Emphasis,
  InlineCode,
  Quote,
  ThematicBreak,
} from '../src';

describe('Markdown Renderer', () => {
  it('renders a simple document', () => {
    const markdown = render(
      <Document>
        <Header level={1}>Title</Header>
        <Paragraph>
          This is a <Strong>simple</Strong> example of a markdown paragraph with
          a <Link href="https://example.com">link</Link>.
        </Paragraph>
        <List>
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 3</ListItem>
        </List>
        <Code language="javascript">{`console.log('Hello, world!');`}</Code>
        <Image src="https://example.com/image.png" alt="Example Image" />
      </Document>
    );

    // Use inline snapshot to capture the exact output
    expect(markdown).toMatchInlineSnapshot(`
      "# Title

      This is a **simple** example of a markdown paragraph with a [link](https://example.com).

      - Item 1
      - Item 2
      - Item 3

      \`\`\`javascript
      console.log('Hello, world!');
      \`\`\`

      ![Example Image](https://example.com/image.png)
      "
    `);
  });

  it('renders nested content correctly', () => {
    const markdown = render(
      <Document>
        <Header level={2}>Nested Content</Header>
        <List>
          <ListItem>
            <Strong>Bold item</Strong> with text
          </ListItem>
          <ListItem>
            Item with <Link href="https://example.com">a link</Link>
          </ListItem>
        </List>
      </Document>
    );

    // Use inline snapshot to capture the exact output
    expect(markdown).toMatchInlineSnapshot(`
      "## Nested Content

      - **Bold item** with text
      - Item with [a link](https://example.com)
      "
    `);
  });

  it('handles top-level text nodes', () => {
    const markdown = render(
      <Document>
        This is a top-level text node with <Strong>bold text</Strong>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "This is a top-level text node with **bold text**
      "
    `);
  });

  it('renders nested paragraphs correctly', () => {
    const markdown = render(
      <Document>
        <Paragraph>
          <Paragraph>This is a nested paragraph.</Paragraph>
          This is in the outer paragraph.
        </Paragraph>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "This is in the outer paragraph.
      "
    `);
  });

  it('handles empty elements', () => {
    const markdown = render(
      <Document>
        <Header level={1}></Header>
        <Paragraph></Paragraph>
        <List></List>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "#



      "
    `);
  });

  it('renders a complex document with mixed formatting', () => {
    const markdown = render(
      <Document>
        <Header level={2}>Mixed Formatting</Header>
        <Paragraph>
          This paragraph has <Strong>bold</Strong>, <Emphasis>italic</Emphasis>,
          and <InlineCode>code</InlineCode> formatting.
        </Paragraph>
        <Quote>
          <Paragraph>This is a blockquote with a paragraph inside.</Paragraph>
          <List>
            <ListItem>And a list</ListItem>
            <ListItem>Inside the quote</ListItem>
          </List>
        </Quote>
        <ThematicBreak />
        <Paragraph>Text after a horizontal rule</Paragraph>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "## Mixed Formatting

      This paragraph has **bold**, *italic*, and \`code\` formatting.

      > This is a blockquote with a paragraph inside.
      >
      > - And a list
      > - Inside the quote

      ---

      Text after a horizontal rule
      "
    `);
  });

  it('handles ordered lists', () => {
    const markdown = render(
      <Document>
        <List ordered={true}>
          <ListItem>First item</ListItem>
          <ListItem>Second item</ListItem>
          <ListItem>
            <Paragraph>Item with a paragraph</Paragraph>
            <List>
              <ListItem>Nested item</ListItem>
            </List>
          </ListItem>
        </List>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "1. First item
      2. Second item
      3. Item with a paragraph
         - Nested item
      "
    `);
  });

  it('handles deeply nested list structures', () => {
    const markdown = render(
      <Document>
        <List>
          <ListItem>
            Top level list item
            <List>
              <ListItem>
                Second level list item
                <List ordered={true}>
                  <ListItem>Ordered sub-item 1</ListItem>
                  <ListItem>
                    Ordered sub-item 2
                    <List>
                      <ListItem>Third level nesting</ListItem>
                      <ListItem>Another third level item</ListItem>
                    </List>
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>Another second level item</ListItem>
            </List>
          </ListItem>
          <ListItem>Another top level item</ListItem>
        </List>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "- Top level list item
        - Second level list item
          1. Ordered sub-item 1
          2. Ordered sub-item 2
             - Third level nesting
             - Another third level item
        - Another second level item
      - Another top level item
      "
    `);
  });

  it('handles edge case with mixed components and text formatting', () => {
    const markdown = render(
      <Document>
        <Paragraph>
          Text with <Strong>bold</Strong> and <Emphasis>italic</Emphasis> mixed
          with
          <InlineCode>inline code</InlineCode> and a{' '}
          <Link href="https://example.com/test?query=value&other=123">
            complex URL
          </Link>
        </Paragraph>
        <List>
          <ListItem>
            <Strong>Item</Strong> with <Emphasis>mixed</Emphasis>{' '}
            <InlineCode>formatting</InlineCode>
          </ListItem>
        </List>
        <Code language="jsx">
          {`// A code example with special characters: & < > " '
function Example() {
  return <div className="test">Content & more</div>;
}`}
        </Code>
        <Paragraph>
          Image with title:{' '}
          <Image
            src="/path/to/image.jpg"
            alt="Alt text with 'quotes'"
            title="Image title with quotes"
          />
        </Paragraph>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "Text with **bold** and *italic* mixed with\`inline code\` and a [complex URL](https://example.com/test?query=value\\&other=123)

      - **Item** with *mixed* \`formatting\`

      \`\`\`jsx
      // A code example with special characters: & < > " '
      function Example() {
        return <div className="test">Content & more</div>;
      }
      \`\`\`

      Image with title:&#x20;
      "
    `);
  });
});
