import Reconciler from "react-reconciler";
import { hostConfig, MarkdownNode } from "./hostConfig";
import { toMarkdown } from "mdast-util-to-markdown";
import { createMdast } from "./mdast";
import type { Root, Content, Text, Heading, Paragraph, 
  Strong, Emphasis, Code, Link, Image, List, ListItem } from "mdast";
const DEBUG = true; // Set to true to enable console.log debugging

// Create our custom reconciler
export const reconciler = Reconciler(hostConfig);

// Create a container for rendering
export function createContainer() {
  return {
    root: {
      type: "Document",
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
    "",
    () => {},
    null
  );

  // Render synchronously
  reconciler.updateContainer(element, root, null, () => {});

  // Debug log the render tree
  if (DEBUG) {
    try {
      console.log(
        "Render tree:",
        JSON.stringify(
          container.root,
          (key, value) => {
            if (key === "parent" || key === "containerInfo" || key === "root") {
              return "[Circular]"; // Avoid circular references
            }
            return value;
          },
          2
        )
      );
    } catch (error) {
      console.log("Failed to stringify render tree:", error);
      console.log("Root type:", container.root.type);
      console.log("Children count:", container.root.children.length);
    }
  }

  // Use our custom mdast builder to create a proper AST

  // After rendering is complete, convert the node tree to a mdast tree
  const mdastRoot = createMdast(container.root);

  if (DEBUG) {
    console.log("MDAST root:", JSON.stringify(mdastRoot, null, 2));
    console.log("Inspect top-level MDAST nodes:");
    mdastRoot.children.forEach((child, index) => {
      console.log(`Node ${index}: type=${child.type}`);
    });
  }

  // Convert the mdast tree to markdown with proper formatting options
  let markdown = toMarkdown(mdastRoot, {
    bullet: "-",            // Use - for unordered lists
    listItemIndent: "one",  // Use one space for list item indentation
    rule: "-",              // Use --- for horizontal rules
    fences: true,           // Use fences for code blocks
    emphasis: "*",          // Use * for emphasis
    strong: "*",            // mdast-util-to-markdown only supports * for strong
  });

  if (DEBUG) {
    console.log("Markdown output:", markdown);
  }

  return markdown;
}

// Function to convert our node tree to mdast
function createMdastFromNode(node: MarkdownNode): Root {
  const root: Root = {
    type: "root",
    children: [],
  };

  populateMdastNode(node, root);

  return root;
}

// Function to convert a node and its children to mdast
function populateMdastNode(
  node: MarkdownNode,
  mdastParent: Root | Content
): void {
  // Handle text nodes directly
  if (node.type === "text" && node.text) {
    const textNode: Text = {
      type: "text",
      value: node.text,
    };

    if ("children" in mdastParent) {
      mdastParent.children.push(textNode);
    }
    return;
  }

  // Convert node based on its type
  let mdastNode: Content | null = null;

  switch (node.type) {
    case "Document":
      // Just process children directly into the root
      if (DEBUG) {
        console.log(
          "Processing Document node with children:",
          node.children.length
        );
      }
      processChildren(node, mdastParent);
      return;

    case "header": {
      const level = node.props["data-level"] || 1;
      const headingNode: Heading = {
        type: "heading",
        depth: level as 1 | 2 | 3 | 4 | 5 | 6,
        children: [],
      };
      mdastNode = headingNode;
      break;
    }

    case "p": {
      const paragraphNode: Paragraph = {
        type: "paragraph",
        children: [],
      };
      mdastNode = paragraphNode;
      break;
    }

    case "strong": {
      const strongNode: Strong = {
        type: "strong",
        children: [],
      };
      mdastNode = strongNode;
      break;
    }

    case "em": {
      const emphasisNode: Emphasis = {
        type: "emphasis",
        children: [],
      };
      mdastNode = emphasisNode;
      break;
    }

    case "code": {
      // Handle inline code
      if (node.parent && node.parent.type !== "pre") {
        const codeNode: Code = {
          type: "inlineCode",
          value: getTextContent(node),
        };
        mdastNode = codeNode;
      }
      break;
    }

    case "pre": {
      // Handle code blocks
      const language = node.props["data-language"] || "";
      const value = getTextContent(node);

      const codeBlockNode: Code = {
        type: "code",
        lang: language,
        value: value,
      };
      mdastNode = codeBlockNode;
      break;
    }

    case "blockquote": {
      const blockquoteNode: Content = {
        type: "blockquote",
        children: [],
      };
      mdastNode = blockquoteNode;
      break;
    }

    case "a": {
      const linkNode: Link = {
        type: "link",
        url: node.props.href || "",
        title: node.props.title || null,
        children: [],
      };
      mdastNode = linkNode;
      break;
    }

    case "img": {
      const imageNode: Image = {
        type: "image",
        url: node.props.src || "",
        alt: node.props.alt || "",
        title: node.props.title || null,
      };
      mdastNode = imageNode;
      break;
    }

    case "ul": {
      const listNode: List = {
        type: "list",
        ordered: false,
        spread: false,
        children: [],
      };
      mdastNode = listNode;
      break;
    }

    case "ol": {
      const listNode: List = {
        type: "list",
        ordered: true,
        spread: false,
        children: [],
      };
      mdastNode = listNode;
      break;
    }

    case "li": {
      const listItemNode: ListItem = {
        type: "listItem",
        spread: false,
        children: [],
      };
      mdastNode = listItemNode;
      break;
    }

    case "hr": {
      const thematicBreakNode: Content = {
        type: "thematicBreak",
      };
      mdastNode = thematicBreakNode;
      break;
    }
  }

  // Add the mdast node to the parent if created
  if (mdastNode) {
    if ("children" in mdastParent) {
      mdastParent.children.push(mdastNode);
    }

    // Process children if the node has a children property
    if ("children" in mdastNode) {
      processChildren(node, mdastNode);
    }
  } else {
    // If no mdast node was created, process children directly into parent
    processChildren(node, mdastParent);
  }
}

// Function to process all children of a node
function processChildren(
  node: MarkdownNode,
  mdastParent: Root | Content
): void {
  for (const child of node.children) {
    populateMdastNode(child, mdastParent);
  }
}

// Helper function to extract text content from a node tree
function getTextContent(node: MarkdownNode): string {
  if (node.type === "text" && node.text) {
    return node.text;
  }

  return node.children.map((child) => getTextContent(child)).join("");
}
