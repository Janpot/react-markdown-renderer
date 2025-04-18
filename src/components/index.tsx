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
  ThematicBreakProps
} from './types';

export const Document: React.FC<DocumentProps> = ({ children }) => {
  return <>{children}</>;
};

export const Header: React.FC<HeaderProps> = ({ level, children }) => {
  return <header data-level={level}>{children}</header>;
};

export const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
  return <p>{children}</p>;
};

export const Strong: React.FC<StrongProps> = ({ children }) => {
  return <strong>{children}</strong>;
};

export const Emphasis: React.FC<EmphasisProps> = ({ children }) => {
  return <em>{children}</em>;
};

export const Text: React.FC<TextProps> = ({ children }) => {
  return <>{children}</>;
};

export const InlineCode: React.FC<InlineCodeProps> = ({ children }) => {
  return <code>{children}</code>;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  return <pre data-language={language}><code>{children}</code></pre>;
};

export const Quote: React.FC<QuoteProps> = ({ children }) => {
  return <blockquote>{children}</blockquote>;
};

export const Link: React.FC<LinkProps> = ({ href, title, children }) => {
  return <a href={href} title={title}>{children}</a>;
};

export const Image: React.FC<ImageProps> = ({ src, alt, title }) => {
  return <img src={src} alt={alt} title={title} />;
};

export const List: React.FC<ListProps> = ({ ordered = false, children }) => {
  return ordered ? <ol>{children}</ol> : <ul>{children}</ul>;
};

export const ListItem: React.FC<ListItemProps> = ({ children }) => {
  return <li>{children}</li>;
};

export const HorizontalRule: React.FC<HorizontalRuleProps> = () => {
  return <hr />;
};

export const ThematicBreak: React.FC<ThematicBreakProps> = () => {
  return <hr />;
};