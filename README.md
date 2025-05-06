# React Markdown Renderer

A React renderer for generating Markdown from React components with full GitHub Flavored Markdown support.

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
  Header,
  Paragraph,
  Strong,
  Link,
  List,
  ListItem,
} from 'react-markdown-renderer';

const markdown = render(
  <>
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
  </>
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

## Features

### Standard Markdown

- Headers (levels 1-6)
- Paragraphs
- Bold text (`<Strong>`)
- Italic text (`<Emphasis>`)
- Links
- Images
- Lists (ordered and unordered)
- Nested lists
- Code blocks with language highlighting
- Inline code
- Blockquotes
- Thematic breaks (horizontal rules)

### GitHub Flavored Markdown

This library fully supports GitHub Flavored Markdown with the following features:

1. **Tables** - Create complex tables with alignment options:

```jsx
<Table>
  <TableRow>
    <TableHeader>Name</TableHeader>
    <TableHeader align="center">Age</TableHeader>
    <TableHeader align="right">Location</TableHeader>
  </TableRow>
  <TableRow>
    <TableCell>John Doe</TableCell>
    <TableCell align="center">25</TableCell>
    <TableCell align="right">New York</TableCell>
  </TableRow>
</Table>
```

2. **Task Lists** - Create checkable list items:

```jsx
<List>
  <ListItem checked={true}>Completed task</ListItem>
  <ListItem checked={false}>Pending task</ListItem>
</List>
```

3. **Strikethrough** - Add strikethrough formatting to text:

```jsx
<Paragraph>
  This text has <Strikethrough>strikethrough content</Strikethrough> within it.
</Paragraph>
```

4. **Autolinks** - URLs are automatically converted to links when rendered

## Example: Document with GFM Features

```jsx
import React from 'react';
import {
  render,
  Header,
  Paragraph,
  Strong,
  Strikethrough,
  Link,
  List,
  ListItem,
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from 'react-markdown-renderer';

const markdown = render(
  <>
    <Header level={1}>GitHub Flavored Markdown Demo</Header>

    <Paragraph>
      This demo shows all GitHub Flavored Markdown features.
    </Paragraph>

    <Header level={2}>Task List</Header>
    <List>
      <ListItem checked={true}>Setup project</ListItem>
      <ListItem checked={false}>Add documentation</ListItem>
    </List>

    <Header level={2}>Feature Comparison</Header>
    <Table>
      <TableRow>
        <TableHeader>Feature</TableHeader>
        <TableHeader align="center">Supported</TableHeader>
      </TableRow>
      <TableRow>
        <TableCell>Basic Markdown</TableCell>
        <TableCell align="center">✅</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Strikethrough>Complex Features</Strikethrough>
        </TableCell>
        <TableCell align="center">✅</TableCell>
      </TableRow>
    </Table>
  </>
);
```

## License

MIT
