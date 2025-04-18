import { HostConfig } from 'react-reconciler';

// Interface for our Markdown node representation
export interface MarkdownNode {
  type: string;
  props: Record<string, any>;
  children: MarkdownNode[];
  text?: string;
  parent?: MarkdownNode;
}

// Type definitions for host context
type Type = string;
type Props = Record<string, any>;
type Container = {
  root: MarkdownNode;
  nodes: Map<number, MarkdownNode>;
};
type Instance = MarkdownNode;
type TextInstance = MarkdownNode;
type HydratableInstance = null;
type PublicInstance = MarkdownNode;
type HostContext = null;
type UpdatePayload = null;
type ChildSet = null;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = -1;

// Host config for markdown rendering
// Type casting to any to avoid TypeScript errors with incompatible react-reconciler types
export const hostConfig: any = {
  // Required by Interface
  now: Date.now,
  isPrimaryRenderer: true,
  noTimeout: -1 as const,
  
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  
  // Required for React 18
  getPublicInstance(instance: Instance): PublicInstance {
    return instance;
  },
  
  getRootHostContext(): HostContext {
    return null;
  },
  
  getChildHostContext(parentHostContext: HostContext): HostContext {
    return null;
  },
  
  prepareForCommit(): null {
    return null;
  },
  
  resetAfterCommit() {},
  
  createInstance(
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext
  ): Instance {
    return {
      type,
      props,
      children: [],
    };
  },
  
  appendInitialChild(parentInstance: Instance, child: Instance | TextInstance) {
    parentInstance.children.push(child);
    child.parent = parentInstance;
  },
  
  finalizeInitialChildren(
    instance: Instance,
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext
  ): boolean {
    return false;
  },
  
  prepareUpdate(
    instance: Instance,
    type: Type,
    oldProps: Props,
    newProps: Props,
    rootContainer: Container,
    hostContext: HostContext
  ): UpdatePayload {
    return {} as unknown as UpdatePayload; // Return non-null to indicate update is needed
  },
  
  shouldSetTextContent(type: Type, props: Props): boolean {
    return false;
  },
  
  createTextInstance(
    text: string,
    rootContainer: Container,
    hostContext: HostContext
  ): TextInstance {
    return {
      type: 'text',
      props: {},
      children: [],
      text,
    };
  },
  
  // Required for mutation
  appendChild(parentInstance: Instance, child: Instance | TextInstance) {
    parentInstance.children.push(child);
    child.parent = parentInstance;
  },
  
  appendChildToContainer(container: Container, child: Instance | TextInstance) {
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
        children: [container.root, child]
      };
      container.root = document;
    }
    
    // Add to nodes map for reference
    const nodeId = container.nodes.size;
    container.nodes.set(nodeId, child);
  },
  
  insertBefore(
    parentInstance: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance
  ) {
    const index = parentInstance.children.indexOf(beforeChild);
    if (index !== -1) {
      parentInstance.children.splice(index, 0, child);
      child.parent = parentInstance;
    }
  },
  
  insertInContainerBefore(
    container: Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance
  ) {
    // This shouldn't happen for our use case
  },
  
  removeChild(parentInstance: Instance, child: Instance | TextInstance) {
    const index = parentInstance.children.indexOf(child);
    if (index !== -1) {
      parentInstance.children.splice(index, 1);
      child.parent = undefined;
    }
  },
  
  removeChildFromContainer(container: Container, child: Instance | TextInstance) {
    container.root = {
      type: 'Document',
      props: {},
      children: [],
    };
    container.nodes.clear();
  },
  
  commitTextUpdate(
    textInstance: TextInstance,
    oldText: string,
    newText: string
  ) {
    textInstance.text = newText;
  },
  
  commitMount() {
    // Noop
  },
  
  commitUpdate(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: Props,
    newProps: Props
  ) {
    instance.props = newProps;
  },
  
  clearContainer(container: Container) {
    container.root = {
      type: 'Document',
      props: {},
      children: [],
    };
    container.nodes.clear();
  },
  
  // Additional required React 18 methods
  detachDeletedInstance() {},
  scheduleDeferredCallback: undefined,
  cancelDeferredCallback: undefined,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  preparePortalMount() {},
  getCurrentEventPriority() { return 0; },
  getInstanceFromNode() { return null; },
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
};