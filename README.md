# React Markdown Renderer

A React renderer for generating Markdown from React components.

## Installation

```bash
npm install react-markdown-renderer
# or
yarn add react-markdown-renderer
# or
pnpm add react-markdown-renderer
```

## Usage

The library provides a set of semantic components that map to markdown elements, and a `render` function to convert them to a markdown string:

```jsx
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
} from 'react-markdown-renderer';

const markdown = render(
  <Document>
    <Header level={1}>Hello World</Header>
    <Paragraph>
      This is a <Strong>paragraph</Strong> with a{' '}
      <Link href="https://example.com">link</Link>
    </Paragraph>
    <List>
      <ListItem>First item</ListItem>
      <ListItem>Second item</ListItem>
      <ListItem>
        Item with a nested list
        <List ordered={true}>
          <ListItem>Nested item 1</ListItem>
          <ListItem>Nested item 2</ListItem>
        </List>
      </ListItem>
    </List>
  </Document>
);

console.log(markdown);
```

The above code will generate the following markdown:

```markdown
# Hello World

This is a **paragraph** with a [link](https://example.com)

- First item
- Second item
- Item with a nested list
  1. Nested item 1
  2. Nested item 2
```

## Available Components

- `Document` - The root component for a markdown document
- `Header` - Heading element (h1-h6) with a `level` prop
- `Paragraph` - Paragraph element
- `Strong` - Bold text
- `Emphasis` - Italic text
- `Link` - Link with `href` and optional `title` props
- `Image` - Image with `src`, `alt`, and optional `title` props
- `List` - Unordered list by default, can be ordered with `ordered={true}`
- `ListItem` - List item
- `CodeBlock` - Code block with optional `language` prop
- `InlineCode` - Inline code
- `Quote` - Blockquote
- `HorizontalRule` - Horizontal rule (thematic break)
- `ThematicBreak` - Alias for HorizontalRule

## License

MIT
