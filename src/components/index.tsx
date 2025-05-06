import React from 'react';
import {
  HeaderProps,
  ParagraphProps,
  StrongProps,
  EmphasisProps,
  StrikethroughProps,
  InlineCodeProps,
  CodeProps,
  QuoteProps,
  LinkProps,
  ImageProps,
  ListProps,
  ListItemProps,
  TableProps,
  TableRowProps,
  TableCellProps,
  TableHeaderProps,
  ThematicBreakProps,
} from './types';

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'md-elm': any;
    }
  }
}

// Higher-level component abstractions that use our simplified node structure

export const Header: React.FC<HeaderProps> = ({ level, children }) => {
  return (
    <md-elm elmType="heading" depth={level}>
      {children}
    </md-elm>
  );
};

export const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
  return <md-elm elmType="paragraph">{children}</md-elm>;
};

export const Strong: React.FC<StrongProps> = ({ children }) => {
  return <md-elm elmType="strong">{children}</md-elm>;
};

export const Emphasis: React.FC<EmphasisProps> = ({ children }) => {
  return <md-elm elmType="emphasis">{children}</md-elm>;
};

export const Strikethrough: React.FC<StrikethroughProps> = ({ children }) => {
  return <md-elm elmType="delete">{children}</md-elm>;
};

export const InlineCode: React.FC<InlineCodeProps> = ({ children }) => {
  return <md-elm elmType="inlineCode" value={children} />;
};

export const Code: React.FC<CodeProps> = ({ language, children }) => {
  return <md-elm elmType="code" lang={language} value={children} />;
};

export const Quote: React.FC<QuoteProps> = ({ children }) => {
  return <md-elm elmType="blockquote">{children}</md-elm>;
};

export const Link: React.FC<LinkProps> = ({ href, title, children }) => {
  return (
    <md-elm elmType="link" url={href} title={title}>
      {children}
    </md-elm>
  );
};

export const Image: React.FC<ImageProps> = ({ src, alt, title }) => {
  return <md-elm elmType="image" url={src} alt={alt} title={title} />;
};

export const List: React.FC<ListProps> = ({ ordered = false, children }) => {
  return (
    <md-elm elmType="list" ordered={ordered}>
      {children}
    </md-elm>
  );
};

export const ListItem: React.FC<ListItemProps> = ({ checked, children }) => {
  return (
    <md-elm elmType="listItem" checked={checked}>
      {children}
    </md-elm>
  );
};

export const Table: React.FC<TableProps> = ({ children }) => {
  return <md-elm elmType="table">{children}</md-elm>;
};

export const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return <md-elm elmType="tableRow">{children}</md-elm>;
};

export const TableCell: React.FC<TableCellProps> = ({ align, children }) => {
  return (
    <md-elm elmType="tableCell" align={align}>
      {children}
    </md-elm>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({
  align,
  children,
}) => {
  return (
    <md-elm elmType="tableHeader" align={align}>
      {children}
    </md-elm>
  );
};

export const ThematicBreak: React.FC<ThematicBreakProps> = () => {
  return <md-elm elmType="thematicBreak" />;
};
