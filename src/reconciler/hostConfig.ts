/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HostConfig } from 'react-reconciler';
import { MarkdownNode, MdText, MdElm, createRoot } from './mdast';

// Type definitions for host context
type Type = string;
type Props = Record<string, unknown>;
type Container = {
  root: MdElm;
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
    if (type === 'md-text') {
      return {
        type: 'md-text',
        value: props.value || '',
      } as MdText;
    }
    
    if (type === 'md-elm') {
      return {
        type: 'md-elm',
        elmType: props.elmType,
        props: { ...props },
        children: [],
      } as MdElm;
    }
    
    throw new Error(
      `Unknown element type: ${type}. Only md-text and md-elm primitives are supported.`
    );
  },

  appendInitialChild(parentInstance, child) {
    if ('children' in parentInstance) {
      parentInstance.children.push(child);
      child.parent = parentInstance;
    }
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
    if ('children' in parentInstance) {
      parentInstance.children.push(child);
      child.parent = parentInstance;
    }
  },

  appendChildToContainer(container, child) {
    // Instead of replacing the root, we should set the root if it doesn't exist
    // or append to root's children if it does
    if (!container.root.elmType) {
      container.root = child as MdElm;
    } else if (container.root.elmType === 'root') {
      container.root.children.push(child);
    } else {
      // Create a document node if needed
      const document: MdElm = {
        type: 'md-elm',
        elmType: 'root',
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
    if ('children' in parentInstance) {
      const index = parentInstance.children.indexOf(beforeChild);
      if (index !== -1) {
        parentInstance.children.splice(index, 0, child);
        child.parent = parentInstance;
      }
    }
  },

  insertInContainerBefore(_container, _child, _beforeChild) {
    // This shouldn't happen for our use case
  },

  removeChild(parentInstance, child) {
    if ('children' in parentInstance) {
      const index = parentInstance.children.indexOf(child);
      if (index !== -1) {
        parentInstance.children.splice(index, 1);
        child.parent = undefined;
      }
    }
  },

  removeChildFromContainer(container, _child) {
    container.root = createRoot();
    container.nodes.clear();
  },

  commitTextUpdate(textInstance, _oldText, newText) {
    (textInstance as MdText).value = newText;
  },

  commitMount() {
    // Noop
  },

  commitUpdate(instance, _updatePayload, type, _oldProps, newProps) {
    if (type === 'md-text' && instance.type === 'md-text') {
      instance.value = newProps.value || '';
      return;
    }
    
    if (type === 'md-elm' && instance.type === 'md-elm') {
      (instance as MdElm).props = { ...newProps };
      return;
    }
  },

  clearContainer(container) {
    container.root = createRoot();
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
