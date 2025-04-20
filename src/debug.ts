import { Node, Root, RootContent } from 'mdast';
import { MarkdownNode } from './reconciler/mdast';

// Check if debugging is enabled via environment variable
export const isDebugEnabled =
  typeof process !== 'undefined' && process.env.DEBUG_MD_RENDERER === 'true';

// Log a message if debugging is enabled
export function log(...args: unknown[]): void {
  if (isDebugEnabled) {
    console.log(...args);
  }
}

// Visualize the node tree and return as string
export function formatTree(node: MarkdownNode, indent = 0): string {
  const prefix = ' '.repeat(indent);
  let result = '';

  if (node.type === 'md-text') {
    result = `${prefix}md-text\n`;
    result += `${prefix}  value: "${node.value}"\n`;
  } else if (node.type === 'md-elm') {
    result = `${prefix}md-elm (${node.elmType})\n`;

    // Print props
    for (const [key, value] of Object.entries(node.props)) {
      if (key !== 'elmType' && key !== 'children') {
        result += `${prefix}  ${key}: ${JSON.stringify(value)}\n`;
      }
    }

    // Print children
    if (node.children && node.children.length > 0) {
      result += `${prefix}  children: [\n`;
      for (const child of node.children) {
        result += formatTree(child, indent + 4);
      }
      result += `${prefix}  ]\n`;
    }
  }

  return result;
}

// Visualize the mdast tree and return as string
export function formatMdast(node: Root | RootContent, indent = 0): string {
  const prefix = ' '.repeat(indent);
  
  // Start with the node type
  let result = `${prefix}${node.type}`;
  
  // For text nodes, display the value directly
  if (node.type === 'text' && 'value' in node) {
    return `${prefix}text "${node.value}"`;
  }
  
  // Add all properties except type and children
  const props = Object.entries(node as Record<string, unknown>)
    .filter(([key]) => key !== 'type' && key !== 'children' && typeof node[key as keyof typeof node] !== 'object')
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(', ');
  
  if (props) {
    result += ` ${props}`;
  }
  
  // Add children if they exist
  if ('children' in node && node.children && node.children.length > 0) {
    result += ` [\n`;
    for (const child of node.children) {
      result += formatMdast(child, indent + 2) + '\n';
    }
    result += `${prefix}]`;
  }
  
  return result;
}
