// Import types for mdast compatible AST
// These types are used by remark/unified ecosystem
import type {
  Root,
  Content,
  PhrasingContent,
  Heading,
  Paragraph,
  Image,
  ListItem,
  Code,
  RootContent,
  BlockContent,
  DefinitionContent,
} from 'mdast';

// Define our markdown node types as a discriminated union
export type MarkdownNode =
  | MdRoot
  | MdHeading
  | MdParagraph
  | MdStrong
  | MdEmphasis
  | MdText
  | MdInlineCode
  | MdCode
  | MdBlockquote
  | MdLink
  | MdImage
  | MdList
  | MdListItem
  | MdThematicBreak;

// Base interface for common properties
interface MdNodeBase {
  parent?: MarkdownNode;
}

export interface MdRoot extends MdNodeBase {
  type: 'md-root';
  children: MarkdownNode[];
}

export interface MdHeading extends MdNodeBase {
  type: 'md-heading';
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: MarkdownNode[];
}

export interface MdParagraph extends MdNodeBase {
  type: 'md-paragraph';
  children: MarkdownNode[];
}

export interface MdStrong extends MdNodeBase {
  type: 'md-strong';
  children: MarkdownNode[];
}

export interface MdEmphasis extends MdNodeBase {
  type: 'md-emphasis';
  children: MarkdownNode[];
}

export interface MdText extends MdNodeBase {
  type: 'md-text';
  value: string;
}

export interface MdInlineCode extends MdNodeBase {
  type: 'md-inlineCode';
  value: string;
}

export interface MdCode extends MdNodeBase {
  type: 'md-code';
  lang?: string;
  value: string;
}

export interface MdBlockquote extends MdNodeBase {
  type: 'md-blockquote';
  children: MarkdownNode[];
}

export interface MdLink extends MdNodeBase {
  type: 'md-link';
  url: string;
  title?: string;
  children: MarkdownNode[];
}

export interface MdImage extends MdNodeBase {
  type: 'md-image';
  url: string;
  alt?: string;
  title?: string;
}

export interface MdList extends MdNodeBase {
  type: 'md-list';
  ordered: boolean;
  children: MarkdownNode[];
}

export interface MdListItem extends MdNodeBase {
  type: 'md-listItem';
  children: MarkdownNode[];
}

export interface MdThematicBreak extends MdNodeBase {
  type: 'md-thematicBreak';
}

/**
 * Creates a valid MDAST (Markdown Abstract Syntax Tree) from our component tree.
 * This follows the mdast spec to ensure proper parent-child relationships.
 */
export function createMdast(node: MarkdownNode): Root {
  // Create root node
  const rootNode: Root = {
    type: 'root',
    children: [],
  };

  // Flatten nested root nodes - we need to handle Document wrapper components
  function flattenRoots(currentNode: MarkdownNode): MarkdownNode[] {
    if (currentNode.type !== 'md-root') {
      return [currentNode];
    }

    // For root nodes, return all their children, and if any of those
    // are also roots, flatten them too
    const result: MarkdownNode[] = [];
    for (const child of currentNode.children) {
      if (child.type === 'md-root') {
        result.push(...flattenRoots(child));
      } else {
        result.push(child);
      }
    }
    return result;
  }

  // Get all actual content nodes by flattening any nested roots
  const contentNodes = flattenRoots(node);

  // Process all the content nodes
  let currentPhrasing: PhrasingContent[] = [];
  let lastWasBlock = false;
  
  for (const contentNode of contentNodes) {
    // Group adjacent inline nodes into paragraphs
    if (isInlineNode(contentNode)) {
      const phrasing = createPhrasing(contentNode);
      if (phrasing) {
        currentPhrasing.push(phrasing);
        lastWasBlock = false;
      }
    } else {
      // If we have any pending inline nodes, create a paragraph for them
      if (currentPhrasing.length > 0) {
        rootNode.children.push({
          type: 'paragraph',
          children: [...currentPhrasing],
        });
        currentPhrasing = [];
      }
      
      // Process block-level content normally
      const content = createFlowContent(contentNode);
      if (content) {
        rootNode.children.push(content);
        lastWasBlock = true;
      }
    }
  }
  
  // Add any remaining pending phrasing content
  if (currentPhrasing.length > 0) {
    rootNode.children.push({
      type: 'paragraph',
      children: currentPhrasing,
    });
  }

  return rootNode;
}

/**
 * Check if a node is an inline-level element that should be wrapped in a paragraph
 */
function isInlineNode(node: MarkdownNode): boolean {
  // These node types should be considered inline
  // Note: md-image is not included here since we want images to be individual block elements
  return [
    'md-text',
    'md-strong',
    'md-emphasis',
    'md-inlineCode',
    'md-link',
  ].includes(node.type);
}

/**
 * Creates a flow content node (block-level element like paragraph, heading, list)
 */
function createFlowContent(
  node: MarkdownNode
): BlockContent | DefinitionContent | null {
  switch (node.type) {
    case 'md-root': {
      // For nested md-root nodes, we process the first child directly
      // Since this is a result of our component structure (Document component)
      if (node.children.length > 0) {
        return createFlowContent(node.children[0]);
      }
      
      // Default fallback to empty paragraph
      return {
        type: 'paragraph',
        children: [],
      };
    }

    case 'md-heading': {
      // Convert md-heading to MDAST heading
      const headingNode: Heading = {
        type: 'heading',
        depth: (node as MdHeading).depth,
        children: createPhrasingContent(node),
      };
      return headingNode;
    }

    case 'md-paragraph': {
      // Convert md-paragraph to MDAST paragraph
      const paragraphNode: Paragraph = {
        type: 'paragraph',
        children: createPhrasingContent(node),
      };
      return paragraphNode;
    }

    case 'md-blockquote': {
      // Convert md-blockquote to MDAST blockquote
      return {
        type: 'blockquote',
        children: node.children
          .map(createFlowContent)
          .filter(Boolean) as BlockContent[],
      };
    }

    case 'md-code': {
      // Convert md-code to MDAST code block
      const codeNode = node as MdCode;
      const codeBlock: Code = {
        type: 'code',
        lang: codeNode.lang || null,
        value: codeNode.value || '',
      };
      return codeBlock;
    }

    case 'md-list': {
      // Convert md-list to MDAST list
      const listNode = node as MdList;
      return {
        type: 'list',
        ordered: listNode.ordered,
        spread: false,
        children: listNode.children
          .filter((child) => child.type === 'md-listItem')
          .map(createListItem)
          .filter(Boolean) as ListItem[],
      };
    }

    case 'md-thematicBreak': {
      // Convert md-thematicBreak to MDAST thematic break
      return { type: 'thematicBreak' };
    }

    case 'md-text':
    case 'md-strong':
    case 'md-emphasis':
    case 'md-link':
    case 'md-inlineCode': {
      // Inline elements need to be wrapped in a paragraph to be valid flow content
      const content = createPhrasing(node);
      if (content) {
        return {
          type: 'paragraph',
          children: [content],
        };
      }
      return null;
    }

    case 'md-image': {
      // Convert md-image to MDAST image (wrapped in paragraph)
      const imageNode = node as MdImage;
      const mdastImage: Image = {
        type: 'image',
        url: imageNode.url || '',
        alt: imageNode.alt || '',
        title: imageNode.title || null,
      };

      return {
        type: 'paragraph',
        children: [mdastImage],
      };
    }

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

/**
 * Creates a list item node from our component
 */
function createListItem(node: MarkdownNode): ListItem | null {
  if (node.type !== 'md-listItem') return null;

  // List items must contain flow content
  const children: (BlockContent | DefinitionContent)[] = [];

  // Track sequences of text nodes that need to be grouped into paragraphs
  let currentTextGroup: MarkdownNode[] = [];

  // Process children in order, grouping adjacent text/inline nodes
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    if (
      child.type === 'md-list' ||
      child.type === 'md-paragraph' ||
      child.type === 'md-blockquote' ||
      child.type === 'md-code'
    ) {
      // When we hit a block element, if we have collected text nodes, create a paragraph
      if (currentTextGroup.length > 0) {
        const textNode: MdParagraph = {
          type: 'md-paragraph',
          children: currentTextGroup,
          parent: node,
        };

        children.push({
          type: 'paragraph',
          children: createPhrasingContent(textNode),
        });

        currentTextGroup = []; // Reset the group
      }

      // Process the block element
      const content = createFlowContent(child);
      if (content) {
        children.push(content);
      }
    } else {
      // Add text/inline nodes to the current group
      currentTextGroup.push(child);
    }
  }

  // Process any remaining text nodes at the end
  if (currentTextGroup.length > 0) {
    // Create a temporary node to process the text content
    const textNode: MdParagraph = {
      type: 'md-paragraph',
      children: currentTextGroup,
      parent: node,
    };

    children.push({
      type: 'paragraph',
      children: createPhrasingContent(textNode),
    });
  }

  // If no children were created, add an empty paragraph to maintain valid structure
  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      children: [],
    });
  }

  return {
    type: 'listItem',
    spread: false,
    children: children,
  };
}

/**
 * Creates a phrasing content node (inline elements like text, emphasis, strong)
 */
function createPhrasing(node: MarkdownNode): PhrasingContent | null {
  switch (node.type) {
    case 'md-text': {
      const textNode = node as MdText;
      return {
        type: 'text',
        value: textNode.value || '',
      };
    }

    case 'md-strong': {
      return {
        type: 'strong',
        children: createPhrasingContent(node),
      };
    }

    case 'md-emphasis': {
      return {
        type: 'emphasis',
        children: createPhrasingContent(node),
      };
    }

    case 'md-inlineCode': {
      const codeNode = node as MdInlineCode;
      return {
        type: 'inlineCode',
        value: codeNode.value || '',
      };
    }

    case 'md-link': {
      const linkNode = node as MdLink;
      return {
        type: 'link',
        url: linkNode.url || '',
        title: linkNode.title || null,
        children: createPhrasingContent(node),
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
  if (node.type === 'md-text') {
    return [
      {
        type: 'text',
        value: (node as MdText).value || '',
      },
    ];
  }

  // Process children to create phrasing content
  return node.children.map(createPhrasing).filter(Boolean) as PhrasingContent[];
}

/**
 * Extract plain text content from a node and its children
 */
function extractTextContent(node: MarkdownNode): string {
  if (node.type === 'md-text') {
    return (node as MdText).value || '';
  }

  if (node.type === 'md-inlineCode') {
    return (node as MdInlineCode).value || '';
  }

  return node.children.map(extractTextContent).join('');
}
