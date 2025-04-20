/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HostConfig } from 'react-reconciler';
import { MarkdownNode, MdRoot, MdText } from './mdast';

// Type definitions for host context
type Type = string;
type Props = Record<string, unknown>;
type Container = {
  root: MdRoot;
  nodes: Map<number, MarkdownNode>;
};
type Instance = MarkdownNode;
type TextInstance = MdText;
type HydratableInstance = never;
type PublicInstance = MarkdownNode;
type HostContext = null;
type UpdatePayload = Record<string, unknown>;
type ChildSet = never;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = -1;
type SuspenseInstance = never;

// Define the HostConfig type for our markdown renderer
// The HostConfig interface from react-reconciler has incompatibilities with our implementation
// We'll use a more general typing approach instead
export const hostConfig: HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
> = {
  isPrimaryRenderer: true,
  noTimeout: -1 as const,

  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  // Required for React 18
  getPublicInstance(instance) {
    return instance;
  },

  getRootHostContext() {
    return null;
  },

  getChildHostContext(_parentHostContext) {
    return null;
  },

  prepareForCommit() {
    return null;
  },

  resetAfterCommit() {},

  createInstance(type, props, _rootContainer, _hostContext) {
    // Only handle our md- prefixed primitives
    switch (type) {
      // Handle our markdown primitives
      case 'md-root':
        return { type, children: [] };
      case 'md-heading':
        return {
          type,
          depth: props.depth as 1 | 2 | 3 | 4 | 5 | 6,
          children: [],
        };
      case 'md-paragraph':
        return { type, children: [] };
      case 'md-strong':
        return { type, children: [] };
      case 'md-emphasis':
        return { type, children: [] };
      case 'md-blockquote':
        return { type, children: [] };
      case 'md-inlineCode':
        return { type, value: props.value || '' };
      case 'md-code':
        return {
          type,
          lang: props.lang,
          value: props.value || '',
        };
      case 'md-link':
        return {
          type,
          url: props.url || '',
          title: props.title,
          children: [],
        };
      case 'md-image':
        return {
          type,
          url: props.url || '',
          alt: props.alt,
          title: props.title,
        };
      case 'md-list':
        return {
          type,
          ordered: !!props.ordered,
          children: [],
        };
      case 'md-listItem':
        return { type, children: [] };
      case 'md-thematicBreak':
        return { type };
      default:
        throw new Error(
          `Unknown element type: ${type}. Only md- prefixed primitives are supported.`
        );
    }
  },

  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child);
    child.parent = parentInstance;
  },

  finalizeInitialChildren(
    _instance,
    _type,
    _props,
    _rootContainer,
    _hostContext
  ) {
    return false;
  },

  prepareUpdate(
    _instance,
    _type,
    _oldProps,
    _newProps,
    _rootContainer,
    _hostContext
  ) {
    // Return a non-null value to indicate an update is needed
    return {};
  },

  shouldSetTextContent(_type, _props) {
    // We want to set text content directly for md-text elements
    // but let React handle other elements normally
    return false;
  },

  createTextInstance(text, _rootContainer, _hostContext) {
    // When React creates text nodes, we turn them into md-text nodes
    return {
      type: 'md-text',
      value: text,
    } as MdText;
  },

  // Required for mutation
  appendChild(parentInstance, child) {
    parentInstance.children.push(child);
    child.parent = parentInstance;
  },

  appendChildToContainer(container, child) {
    // Instead of replacing the root, we should set the root if it doesn't exist
    // or append to root's children if it does
    if (!container.root.type) {
      container.root = child as MdRoot;
    } else if (container.root.type === 'md-root') {
      container.root.children.push(child);
    } else {
      // Create a document node if needed
      const document: MdRoot = {
        type: 'md-root',
        children: [container.root, child],
      };
      container.root = document;
    }

    // Add to nodes map for reference
    const nodeId = container.nodes.size;
    container.nodes.set(nodeId, child);
  },

  insertBefore(parentInstance, child, beforeChild) {
    const index = parentInstance.children.indexOf(beforeChild);
    if (index !== -1) {
      parentInstance.children.splice(index, 0, child);
      child.parent = parentInstance;
    }
  },

  insertInContainerBefore(_container, _child, _beforeChild) {
    // This shouldn't happen for our use case
  },

  removeChild(parentInstance, child) {
    const index = parentInstance.children.indexOf(child);
    if (index !== -1) {
      parentInstance.children.splice(index, 1);
      child.parent = undefined;
    }
  },

  removeChildFromContainer(container, _child) {
    container.root = {
      type: 'md-root',
      children: [],
    };
    container.nodes.clear();
  },

  commitTextUpdate(textInstance, _oldText, newText) {
    (textInstance as MdText).value = newText;
  },

  commitMount() {
    // Noop
  },

  commitUpdate(instance, _updatePayload, type, _oldProps, newProps) {
    // Handle updates based on node type
    switch (type) {
      case 'md-heading':
        (instance as MdHeading).depth = newProps.depth || 1;
        break;
      case 'md-code':
        (instance as MdCode).lang = newProps.lang;
        if (newProps.value !== undefined) {
          (instance as MdCode).value = newProps.value;
        }
        break;
      case 'md-inlineCode':
        if (newProps.value !== undefined) {
          (instance as MdInlineCode).value = newProps.value;
        }
        break;
      case 'md-link':
        (instance as MdLink).url = newProps.url || '';
        (instance as MdLink).title = newProps.title;
        break;
      case 'md-image':
        (instance as MdImage).url = newProps.url || '';
        (instance as MdImage).alt = newProps.alt;
        (instance as MdImage).title = newProps.title;
        break;
      case 'md-list':
        (instance as MdList).ordered = !!newProps.ordered;
        break;
      case 'md-root':
      case 'md-paragraph':
      case 'md-strong':
      case 'md-emphasis':
      case 'md-blockquote':
      case 'md-listItem':
      case 'md-thematicBreak':
        // These elements don't have additional props to update
        break;
      default:
        throw new Error(`Unknown element type in update: ${type}`);
    }
  },

  clearContainer(container) {
    container.root = {
      type: 'md-root',
      children: [],
    };
    container.nodes.clear();
  },

  // Additional required React 18 methods
  detachDeletedInstance() {},
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  preparePortalMount() {},
  getCurrentEventPriority() {
    return 0;
  },
  getInstanceFromNode() {
    return null;
  },
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  prepareScopeUpdate: function (scopeInstance: any, instance: any): void {
    throw new Error('Function not implemented.');
  },
  getInstanceFromScope: function (scopeInstance: any): MarkdownNode | null {
    throw new Error('Function not implemented.');
  },
};
