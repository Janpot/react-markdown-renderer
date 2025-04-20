import { ReactNode } from 'react';
import { HeadingDepth } from '../reconciler/mdast';

export interface DocumentProps {
  children?: ReactNode;
}

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
  children?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThematicBreakProps {
  // This interface intentionally left empty as ThematicBreak has no props
  // but needs to exist for consistent typing
}

export interface MarkdownComponents {
  Document: React.FC<DocumentProps>;
  Header: React.FC<HeaderProps>;
  Paragraph: React.FC<ParagraphProps>;
  Strong: React.FC<StrongProps>;
  Emphasis: React.FC<EmphasisProps>;
  InlineCode: React.FC<InlineCodeProps>;
  Code: React.FC<CodeProps>;
  Quote: React.FC<QuoteProps>;
  Link: React.FC<LinkProps>;
  Image: React.FC<ImageProps>;
  List: React.FC<ListProps>;
  ListItem: React.FC<ListItemProps>;
  ThematicBreak: React.FC<ThematicBreakProps>;
}
