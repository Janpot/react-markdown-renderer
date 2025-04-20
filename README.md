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

## Using Markdown Primitives Directly

You can also use the markdown primitives directly, which map closely to the mdast specification:

```jsx
import React from 'react';
import { render } from 'react-markdown-renderer';

const markdown = render(
  <md-root>
    <md-heading depth={1}>Direct Primitive Usage</md-heading>
    <md-paragraph>
      This uses <md-strong>primitives directly</md-strong> with a{' '}
      <md-link url="https://example.com" title="Optional title">
        link
      </md-link>
    </md-paragraph>
    <md-list ordered={false}>
      <md-listItem>First item</md-listItem>
      <md-listItem>Second item</md-listItem>
    </md-list>
    <md-code lang="javascript" value="console.log('Hello world');"></md-code>
  </md-root>
);
```

## Available Components and Primitives

### Convenience Components

- `Document` - Wraps `<md-root>`
- `Header` - Wraps `<md-heading depth={1-6}>`
- `Paragraph` - Wraps `<md-paragraph>`
- `Strong` - Wraps `<md-strong>`
- `Emphasis` - Wraps `<md-emphasis>`
- `Link` - Wraps `<md-link url="..." title="...">`
- `Image` - Wraps `<md-image url="..." alt="..." title="...">`
- `List` - Wraps `<md-list ordered={boolean}>`
- `ListItem` - Wraps `<md-listItem>`
- `CodeBlock` - Wraps `<md-code lang="...">`
- `InlineCode` - Wraps `<md-inlineCode>`
- `Quote` - Wraps `<md-blockquote>`
- `HorizontalRule` - Wraps `<md-thematicBreak>`
- `ThematicBreak` - Alias for HorizontalRule

### Markdown Primitives

- `<md-root>` - Root document element
- `<md-heading depth={1-6}>` - Heading with specified depth
- `<md-paragraph>` - Paragraph element
- `<md-strong>` - Strong emphasis (bold)
- `<md-emphasis>` - Emphasis (italic)
- `<md-text value="...">` - Text node (usually created automatically)
- `<md-inlineCode value="...">` - Inline code
- `<md-code lang="..." value="...">` - Code block with optional language
- `<md-blockquote>` - Blockquote
- `<md-link url="..." title="...">` - Link with url and optional title
- `<md-image url="..." alt="..." title="...">` - Image with url, alt, and optional title
- `<md-list ordered={boolean}>` - List (ordered or unordered)
- `<md-listItem>` - List item
- `<md-thematicBreak>` - Horizontal rule/thematic break

## Architecture

This library uses a discriminated union type system for its internal representation, with each markdown node being a specific type like `MdRoot`, `MdHeading`, etc. These types map directly to the MDAST (Markdown Abstract Syntax Tree) specification used by the unified/remark ecosystem.

Benefits of this approach:

1. Type safety with exhaustive type checking
2. Clear, direct mapping to markdown structures
3. Easy to understand and extend
4. Optimized for performance by eliminating transformation steps

## License

MIT
