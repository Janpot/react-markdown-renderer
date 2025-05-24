import { ReactNode } from 'react';
import { HeadingDepth } from '../reconciler/mdast';

export interface HeaderProps {
  level: HeadingDepth;
  children?: ReactNode;
}

export interface ParagraphProps {
  children?: ReactNode;
}

export interface StrongProps {
  children?: ReactNode;
}

export interface EmphasisProps {
  children?: ReactNode;
}

export interface StrikethroughProps {
  children?: ReactNode;
}

export interface InlineCodeProps {
  children: string;
}

export interface CodeProps {
  language?: string;
  children: string;
}

export interface QuoteProps {
  children?: ReactNode;
}

export interface LinkProps {
  href: string;
  title?: string;
  children?: ReactNode;
}

export interface ImageProps {
  src: string;
  alt?: string;
  title?: string;
}

export interface ListProps {
  ordered?: boolean;
  children?: ReactNode;
}

export interface ListItemProps {
  checked?: boolean
  children?: ReactNode
}

export type TableCellAlignment = 'left' | 'center' | 'right' | undefined;

export interface TableProps {
  children: ReactNode;
}

export interface TableRowProps {
  children: ReactNode;
}

export interface TableCellProps {
  align?: TableCellAlignment;
  children?: ReactNode;
}

export interface TableHeaderProps {
  align?: TableCellAlignment;
  children?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThematicBreakProps {
  // This interface intentionally left empty as ThematicBreak has no props
  // but needs to exist for consistent typing
}

export interface MarkdownComponents {
  Header: React.FC<HeaderProps>;
  Paragraph: React.FC<ParagraphProps>;
  Strong: React.FC<StrongProps>;
  Emphasis: React.FC<EmphasisProps>;
  Strikethrough: React.FC<StrikethroughProps>;
  InlineCode: React.FC<InlineCodeProps>;
  Code: React.FC<CodeProps>;
  Quote: React.FC<QuoteProps>;
  Link: React.FC<LinkProps>;
  Image: React.FC<ImageProps>;
  List: React.FC<ListProps>;
  ListItem: React.FC<ListItemProps>;
  Table: React.FC<TableProps>;
  TableRow: React.FC<TableRowProps>;
  TableCell: React.FC<TableCellProps>;
  TableHeader: React.FC<TableHeaderProps>;
  ThematicBreak: React.FC<ThematicBreakProps>;
}
