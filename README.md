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

This library uses a set of markdown-specific primitives prefixed with `md-` that map directly to markdown elements. It also provides convenience components and a `render` function to convert them to a markdown string:

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

## License

MIT
