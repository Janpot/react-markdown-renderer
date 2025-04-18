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

```jsx
import { renderToMarkdown } from 'react-markdown-renderer';

const markdown = renderToMarkdown(
  <div>
    <h1>Hello World</h1>
    <p>This is a paragraph</p>
  </div>
);

console.log(markdown);
// # Hello World
// 
// This is a paragraph
```
