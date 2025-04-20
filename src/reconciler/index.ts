import Reconciler from 'react-reconciler';
import { hostConfig } from './hostConfig';
import { toMarkdown } from 'mdast-util-to-markdown';
import { createMdast, createRoot } from './mdast';
import { MarkdownNode } from './mdast';
import * as debug from '../debug';

// Create our custom reconciler
export const reconciler = Reconciler(hostConfig);

// Create a container for rendering
export function createContainer() {
  return {
    root: createRoot(),
    nodes: new Map<number, MarkdownNode>(),
  };
}

// Render function that returns markdown string
export function renderToMarkdown(element: React.ReactElement): string {
  const container = createContainer();

  // React 18 compatible API
  const root = reconciler.createContainer(
    container,
    0,
    null,
    false,
    null,
    '',
    () => {},
    null
  );

  // Render synchronously
  reconciler.updateContainer(element, root, null, () => {});

  // Debug: Print our internal tree
  debug.log('=== MARKDOWN NODE TREE ===');
  debug.log(debug.formatTree(container.root));

  // After rendering is complete, convert the node tree to a mdast tree
  const mdastRoot = createMdast(container.root);

  // Debug: Print the mdast tree
  debug.log('=== MDAST TREE ===');
  debug.log(debug.formatMdast(mdastRoot));

  // Convert the mdast tree to markdown with proper formatting options
  let markdown = toMarkdown(mdastRoot, {
    bullet: '-', // Use - for unordered lists
    listItemIndent: 'one', // Use one space for list item indentation
    rule: '-', // Use --- for horizontal rules
    fences: true, // Use fences for code blocks
    emphasis: '*', // Use * for emphasis
    strong: '*', // mdast-util-to-markdown only supports * for strong
  });

  debug.log('=== GENERATED MARKDOWN ===');
  debug.log(markdown);

  return markdown;
}
