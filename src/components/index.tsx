import React from 'react';
import {
  DocumentProps,
  HeaderProps,
  ParagraphProps,
  StrongProps,
  EmphasisProps,
  TextProps,
  InlineCodeProps,
  CodeBlockProps,
  QuoteProps,
  LinkProps,
  ImageProps,
  ListProps,
  ListItemProps,
  HorizontalRuleProps,
  ThematicBreakProps,
} from './types';

// Higher-level component abstractions that use our primitives
export const Document: React.FC<DocumentProps> = ({ children }) => {
  return <md-root>{children}</md-root>;
};

export const Header: React.FC<HeaderProps> = ({ level, children }) => {
  return <md-heading depth={level}>{children}</md-heading>;
};

export const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
  return <md-paragraph>{children}</md-paragraph>;
};

export const Strong: React.FC<StrongProps> = ({ children }) => {
  return <md-strong>{children}</md-strong>;
};

export const Emphasis: React.FC<EmphasisProps> = ({ children }) => {
  return <md-emphasis>{children}</md-emphasis>;
};

export const Text: React.FC<TextProps> = ({ children }) => {
  // We need to create a proper md-text node with a value
  return <md-text value={children} />;
};

export const InlineCode: React.FC<InlineCodeProps> = ({ children }) => {
  return <md-inlineCode value={children}></md-inlineCode>;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  return <md-code lang={language} value={children}></md-code>;
};

export const Quote: React.FC<QuoteProps> = ({ children }) => {
  return <md-blockquote>{children}</md-blockquote>;
};

export const Link: React.FC<LinkProps> = ({ href, title, children }) => {
  return (
    <md-link url={href} title={title}>
      {children}
    </md-link>
  );
};

export const Image: React.FC<ImageProps> = ({ src, alt, title }) => {
  return <md-image url={src} alt={alt} title={title} />;
};

export const List: React.FC<ListProps> = ({ ordered = false, children }) => {
  return <md-list ordered={ordered}>{children}</md-list>;
};

export const ListItem: React.FC<ListItemProps> = ({ children }) => {
  return <md-listItem>{children}</md-listItem>;
};

export const HorizontalRule: React.FC<HorizontalRuleProps> = () => {
  return <md-thematicBreak />;
};

export const ThematicBreak: React.FC<ThematicBreakProps> = () => {
  return <md-thematicBreak />;
};
