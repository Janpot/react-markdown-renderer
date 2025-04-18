import { MarkdownNode } from './hostConfig';
// Import types for mdast compatible AST
// These types are used by remark/unified ecosystem
import type { Root, Content, PhrasingContent, Heading, Paragraph, Strong, 
  Emphasis, Link, Image, List, ListItem, Code } from 'mdast';

/**
 * Creates a valid MDAST (Markdown Abstract Syntax Tree) from our component tree.
 * This follows the mdast spec to ensure proper parent-child relationships.
 */
export function createMdast(node: MarkdownNode): Root {
  // Create root node
  const rootNode: Root = {
    type: 'root',
    children: []
  };
  
  // Process Document node's children 
  if (node.type === 'Document') {
    for (const child of node.children) {
      const content = createFlowContent(child);
      if (content) {
        rootNode.children.push(content);
      }
    }
  } else {
    // If the top node isn't Document, try to convert it directly
    const content = createFlowContent(node);
    if (content) {
      rootNode.children.push(content);
    }
  }
  
  return rootNode;
}

/**
 * Creates a flow content node (block-level element like paragraph, heading, list)
 */
function createFlowContent(node: MarkdownNode): Content | null {
  switch (node.type) {
    case 'header': {
      // Headers become heading nodes with phrasing content children
      const level = Math.min(Math.max(node.props['data-level'] || 1, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
      const headingNode: Heading = {
        type: 'heading',
        depth: level,
        children: createPhrasingContent(node)
      };
      return headingNode;
    }
    
    case 'p': {
      // Paragraphs contain phrasing content
      const paragraphNode: Paragraph = {
        type: 'paragraph',
        children: createPhrasingContent(node)
      };
      return paragraphNode;
    }
    
    case 'blockquote': {
      // Blockquotes contain flow content
      return {
        type: 'blockquote',
        children: node.children
          .map(createFlowContent)
          .filter(Boolean) as Content[]
      };
    }
    
    case 'pre': {
      // Pre elements become code blocks
      const codeNode = node.children.find(child => child.type === 'code');
      if (codeNode) {
        const language = node.props['data-language'] || '';
        const value = extractTextContent(codeNode);
        
        const codeBlock: Code = {
          type: 'code',
          lang: language,
          value: value
        };
        return codeBlock;
      }
      return null;
    }
    
    case 'ul': {
      // Unordered lists contain list items
      return {
        type: 'list',
        ordered: false,
        spread: false,
        children: node.children
          .filter(child => child.type === 'li')
          .map(createListItem)
          .filter(Boolean) as ListItem[]
      };
    }
    
    case 'ol': {
      // Ordered lists contain list items
      return {
        type: 'list',
        ordered: true,
        spread: false,
        children: node.children
          .filter(child => child.type === 'li')
          .map(createListItem)
          .filter(Boolean) as ListItem[]
      };
    }
    
    case 'hr': {
      // Horizontal rules are thematic breaks
      return { type: 'thematicBreak' };
    }
    
    case 'text':
    case 'strong':
    case 'em':
    case 'a': 
    case 'code': {
      // Inline elements need to be wrapped in a paragraph to be valid flow content
      const content = createPhrasing(node);
      if (content) {
        return {
          type: 'paragraph',
          children: [content]
        };
      }
      return null;
    }
    
    case 'img': {
      // Images need to be wrapped in paragraphs (common markdown convention)
      const src = node.props.src || '';
      const alt = node.props.alt || '';
      const title = node.props.title || null;
      
      const imageNode: Image = {
        type: 'image',
        url: src,
        alt: alt,
        title: title
      };
      
      return {
        type: 'paragraph',
        children: [imageNode]
      };
    }
    
    default:
      return null;
  }
}

/**
 * Creates a list item node from our component
 */
function createListItem(node: MarkdownNode): ListItem | null {
  if (node.type !== 'li') return null;
  
  // List items must contain flow content
  // For simplicity, we'll wrap everything in a paragraph
  return {
    type: 'listItem',
    spread: false,
    children: [{
      type: 'paragraph',
      children: createPhrasingContent(node)
    }]
  };
}

/**
 * Creates a phrasing content node (inline elements like text, emphasis, strong)
 */
function createPhrasing(node: MarkdownNode): PhrasingContent | null {
  switch (node.type) {
    case 'text': {
      return {
        type: 'text',
        value: node.text || ''
      };
    }
    
    case 'strong': {
      return {
        type: 'strong',
        children: createPhrasingContent(node)
      };
    }
    
    case 'em': {
      return {
        type: 'emphasis',
        children: createPhrasingContent(node)
      };
    }
    
    case 'code': {
      // Only handle inline code here (code blocks are handled by pre)
      if (node.parent && node.parent.type === 'pre') {
        return null;
      }
      
      return {
        type: 'inlineCode',
        value: extractTextContent(node)
      };
    }
    
    case 'a': {
      const href = node.props.href || '';
      const title = node.props.title || null;
      
      return {
        type: 'link',
        url: href,
        title: title,
        children: createPhrasingContent(node)
      };
    }
    
    default:
      return null;
  }
}

/**
 * Creates an array of phrasing content from a node's children
 */
function createPhrasingContent(node: MarkdownNode): PhrasingContent[] {
  // For text nodes, return them directly
  if (node.type === 'text' && node.text) {
    return [{
      type: 'text',
      value: node.text
    }];
  }
  
  // Process children to create phrasing content
  return node.children
    .map(createPhrasing)
    .filter(Boolean) as PhrasingContent[];
}

/**
 * Extract plain text content from a node and its children
 */
function extractTextContent(node: MarkdownNode): string {
  if (node.type === 'text' && node.text) {
    return node.text;
  }
  
  return node.children.map(extractTextContent).join('');
}