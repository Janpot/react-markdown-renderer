/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HostConfig } from 'react-reconciler';

// Interface for our Markdown node representation
export interface MarkdownNode {
  type: string;
  props: Record<string, unknown>;
  children: MarkdownNode[];
  text?: string;
  parent?: MarkdownNode;
}

// Type definitions for host context
type Type = string;
type Props = Record<string, unknown>;
type Container = {
  root: MarkdownNode;
  nodes: Map<number, MarkdownNode>;
};
type Instance = MarkdownNode;
type TextInstance = MarkdownNode;
type HydratableInstance = never;
type PublicInstance = MarkdownNode;
type HostContext = null;
type UpdatePayload = Record<string, unknown>;
type ChildSet = never;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = -1;
type SuspenseInstance = never;

// Define the HostConfig type for our markdown renderer
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - HostConfig type is not fully compatible with our implementation
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
    return {
      type,
      props,
      children: [],
    };
  },

  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child);
    child.parent = parentInstance;
  },

  finalizeInitialChildren(_instance, _type, _props, _rootContainer, _hostContext) {
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
    return false;
  },

  createTextInstance(text, _rootContainer, _hostContext) {
    return {
      type: 'text',
      props: {},
      children: [],
      text,
    };
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
      container.root = child;
    } else if (container.root.type === 'Document') {
      container.root.children.push(child);
    } else {
      // Create a document node if needed
      const document: MarkdownNode = {
        type: 'Document',
        props: {},
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
      type: 'Document',
      props: {},
      children: [],
    };
    container.nodes.clear();
  },

  commitTextUpdate(textInstance, _oldText, newText) {
    textInstance.text = newText;
  },

  commitMount() {
    // Noop
  },

  commitUpdate(instance, _updatePayload, _type, _oldProps, newProps) {
    instance.props = newProps;
  },

  clearContainer(container) {
    container.root = {
      type: 'Document',
      props: {},
      children: [],
    };
    container.nodes.clear();
  },

  // Additional required React 18 methods
  detachDeletedInstance() {},
  cancelDeferredCallback: undefined,
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
};