import Reconciler from 'react-reconciler';
import { hostConfig, MarkdownNode } from './hostConfig';
import { toMarkdown } from 'mdast-util-to-markdown';
import { createMdast } from './mdast';
const DEBUG = true; // Set to true to enable console.log debugging

// Create our custom reconciler
export const reconciler = Reconciler(hostConfig);

// Create a container for rendering
export function createContainer() {
  return {
    root: {
      type: 'Document',
      props: {},
      children: [],
    } as MarkdownNode,
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

  // Debug log the render tree
  if (DEBUG) {
    try {
      console.log(
        'Render tree:',
        JSON.stringify(
          container.root,
          (key, value) => {
            if (key === 'parent' || key === 'containerInfo' || key === 'root') {
              return '[Circular]'; // Avoid circular references
            }
            return value;
          },
          2
        )
      );
    } catch (error) {
      console.log('Failed to stringify render tree:', error);
      console.log('Root type:', container.root.type);
      console.log('Children count:', container.root.children.length);
    }
  }

  // After rendering is complete, convert the node tree to a mdast tree
  const mdastRoot = createMdast(container.root);

  if (DEBUG) {
    console.log('MDAST root:', JSON.stringify(mdastRoot, null, 2));
    console.log('Inspect top-level MDAST nodes:');
    mdastRoot.children.forEach((child, index) => {
      console.log(`Node ${index}: type=${child.type}`);
    });
  }

  // Convert the mdast tree to markdown with proper formatting options
  let markdown = toMarkdown(mdastRoot, {
    bullet: '-', // Use - for unordered lists
    listItemIndent: 'one', // Use one space for list item indentation
    rule: '-', // Use --- for horizontal rules
    fences: true, // Use fences for code blocks
    emphasis: '*', // Use * for emphasis
    strong: '*', // mdast-util-to-markdown only supports * for strong
  });

  if (DEBUG) {
    console.log('Markdown output:', markdown);
  }

  return markdown;
}
