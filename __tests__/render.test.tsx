import { describe, it, expect } from "vitest";
import React from "react";
import {
  render,
  Document,
  Header,
  Paragraph,
  Strong,
  Link,
  List,
  ListItem,
  CodeBlock,
  Image,
} from "../src";

describe("Markdown Renderer", () => {
  it("renders a simple document", () => {
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
        <CodeBlock language="javascript">
          {`console.log('Hello, world!');`}
        </CodeBlock>
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

  it("renders nested content correctly", () => {
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
});
