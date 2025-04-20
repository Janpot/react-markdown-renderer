// Import types for mdast compatible AST
// These types are used by remark/unified ecosystem
import type {
  Root,
  PhrasingContent,
  Heading,
  Paragraph,
  Image,
  ListItem,
  Code,
  BlockContent,
  DefinitionContent,
} from 'mdast';

// Import validation utilities
import * as validate from '../utils/validate';

// Define heading depth type
export type HeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

// Base interface for common properties
interface MdNodeBase {
  parent?: MarkdownNode;
}

// Simplified markdown node types - just text and elements
export interface MdText extends MdNodeBase {
  type: 'md-text';
  value: string;
}

export interface MdElm extends MdNodeBase {
  type: 'md-elm';
  elmType: string;
  props: Record<string, unknown>;
  children: MarkdownNode[];
}

// Define our markdown node types as a discriminated union
export type MarkdownNode = MdText | MdElm;

// Helper to create a root node
export function createRoot(): MdElm {
  return {
    type: 'md-elm',
    elmType: 'root',
    props: {},
    children: [],
  };
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

  // Flatten nested root nodes - needed to handle when a root element is directly passed to render
  function flattenRoots(currentNode: MarkdownNode): MarkdownNode[] {
    if (currentNode.type === 'md-text') {
      return [currentNode];
    }

    if (currentNode.elmType !== 'root') {
      return [currentNode];
    }

    // For root nodes, return all their children, and if any of those
    // are also roots, flatten them too
    const result: MarkdownNode[] = [];
    for (const child of currentNode.children) {
      if (child.type === 'md-elm' && child.elmType === 'root') {
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

  for (const contentNode of contentNodes) {
    // Group adjacent inline nodes into paragraphs
    if (isInlineNode(contentNode)) {
      const phrasing = createPhrasing(contentNode);
      if (phrasing) {
        currentPhrasing.push(phrasing);
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
  if (node.type === 'md-text') {
    return true;
  }

  // These node types should be considered inline
  // Note: Image is not included here since we want images to be individual block elements
  const inlineTypes = ['strong', 'emphasis', 'inlineCode', 'link'];
  return node.type === 'md-elm' && inlineTypes.includes(node.elmType);
}

/**
 * Creates a flow content node (block-level element like paragraph, heading, list)
 */
function createFlowContent(
  node: MarkdownNode
): BlockContent | DefinitionContent | null {
  if (node.type === 'md-text') {
    // Text nodes are wrapped in paragraphs when they're at the flow level
    return {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: node.value || '',
        },
      ],
    };
  }

  if (node.type !== 'md-elm') {
    throw new Error(
      `Unknown node type: ${String((node as MarkdownNode).type)}`
    );
  }

  // Handle element nodes based on their elmType
  switch (node.elmType) {
    case 'root': {
      // For nested root nodes, we process the first child directly
      if (node.children.length > 0) {
        return createFlowContent(node.children[0]);
      }

      // Default fallback to empty paragraph
      return {
        type: 'paragraph',
        children: [],
      };
    }

    case 'heading': {
      // Convert heading to MDAST heading
      const depth = validate.headingDepth(node.props.depth, 1);

      const headingNode: Heading = {
        type: 'heading',
        depth: depth,
        children: createPhrasingContent(node),
      };
      return headingNode;
    }

    case 'paragraph': {
      // Convert paragraph to MDAST paragraph
      const paragraphNode: Paragraph = {
        type: 'paragraph',
        children: createPhrasingContent(node),
      };
      return paragraphNode;
    }

    case 'blockquote': {
      // Convert blockquote to MDAST blockquote
      return {
        type: 'blockquote',
        children: node.children
          .map(createFlowContent)
          .filter(Boolean) as BlockContent[],
      };
    }

    case 'code': {
      // Convert code to MDAST code block
      const codeBlock: Code = {
        type: 'code',
        lang: validate.maybeString(node.props.lang) || null,
        value: validate.string(node.props.value, ''),
      };
      return codeBlock;
    }

    case 'list': {
      // Convert list to MDAST list
      return {
        type: 'list',
        ordered: validate.boolean(node.props.ordered, false),
        spread: false,
        children: node.children
          .filter(
            (child) => child.type === 'md-elm' && child.elmType === 'listItem'
          )
          .map(createListItem)
          .filter(Boolean) as ListItem[],
      };
    }

    case 'thematicBreak': {
      // Convert thematicBreak to MDAST thematic break
      return { type: 'thematicBreak' };
    }

    case 'strong':
    case 'emphasis':
    case 'link':
    case 'inlineCode': {
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

    case 'image': {
      // Convert image to MDAST image (wrapped in paragraph)
      const mdastImage: Image = {
        type: 'image',
        url: validate.string(node.props.url, ''),
        alt: validate.string(node.props.alt, ''),
        title: validate.maybeString(node.props.title) || null,
      };

      return {
        type: 'paragraph',
        children: [mdastImage],
      };
    }

    default:
      throw new Error(`Unknown element type: ${node.elmType}`);
  }
}

/**
 * Creates a list item node from our component
 */
function createListItem(node: MarkdownNode): ListItem | null {
  if (node.type !== 'md-elm' || node.elmType !== 'listItem') return null;

  // List items must contain flow content
  const children: (BlockContent | DefinitionContent)[] = [];

  // Track sequences of text nodes that need to be grouped into paragraphs
  let currentTextGroup: MarkdownNode[] = [];

  // Process children in order, grouping adjacent text/inline nodes
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    if (
      child.type === 'md-elm' &&
      (child.elmType === 'list' ||
        child.elmType === 'paragraph' ||
        child.elmType === 'blockquote' ||
        child.elmType === 'code')
    ) {
      // When we hit a block element, if we have collected text nodes, create a paragraph
      if (currentTextGroup.length > 0) {
        const paragraphNode: MdElm = {
          type: 'md-elm',
          elmType: 'paragraph',
          props: {},
          children: currentTextGroup,
          parent: node,
        };

        children.push({
          type: 'paragraph',
          children: createPhrasingContent(paragraphNode),
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
    const paragraphNode: MdElm = {
      type: 'md-elm',
      elmType: 'paragraph',
      props: {},
      children: currentTextGroup,
      parent: node,
    };

    children.push({
      type: 'paragraph',
      children: createPhrasingContent(paragraphNode),
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
  if (node.type === 'md-text') {
    return {
      type: 'text',
      value: validate.string(node.value, ''),
    };
  }

  if (node.type !== 'md-elm') {
    return null;
  }

  switch (node.elmType) {
    case 'strong': {
      return {
        type: 'strong',
        children: createPhrasingContent(node),
      };
    }

    case 'emphasis': {
      return {
        type: 'emphasis',
        children: createPhrasingContent(node),
      };
    }

    case 'inlineCode': {
      return {
        type: 'inlineCode',
        value: validate.string(node.props.value, ''),
      };
    }

    case 'link': {
      return {
        type: 'link',
        url: validate.string(node.props.url, ''),
        title: validate.maybeString(node.props.title) || null,
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
        value: validate.string(node.value, ''),
      },
    ];
  }

  // Process children to create phrasing content
  return node.children.map(createPhrasing).filter(Boolean) as PhrasingContent[];
}
