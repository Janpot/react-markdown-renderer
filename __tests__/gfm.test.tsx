import { describe, it, expect } from 'vitest';
import React from 'react';
import {
  render,
  Header,
  Paragraph,
  List,
  ListItem,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Strong,
  Emphasis,
  Strikethrough,
  Link,
} from '../src';

describe('GitHub Flavored Markdown Features', () => {
  it('renders tables correctly', () => {
    const markdown = render(
      <>
        <Header level={2}>Table Example</Header>
        <Table>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader align="center">Age</TableHeader>
            <TableHeader align="right">Location</TableHeader>
          </TableRow>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell align="center">25</TableCell>
            <TableCell align="right">New York</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell align="center">32</TableCell>
            <TableCell align="right">San Francisco</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Robert Johnson</TableCell>
            <TableCell align="center">45</TableCell>
            <TableCell align="right">Chicago</TableCell>
          </TableRow>
        </Table>
      </>
    );

    // Update snapshot to match the formatting produced by mdast-util-to-markdown with GFM
    expect(markdown).toMatchInlineSnapshot(`
      "## Table Example

      | Name           | Age |      Location |
      | -------------- | :-: | ------------: |
      | John Doe       |  25 |      New York |
      | Jane Smith     |  32 | San Francisco |
      | Robert Johnson |  45 |       Chicago |
      "
    `);
  });

  it('renders task list items correctly', () => {
    const markdown = render(
      <>
        <Header level={2}>Task List</Header>
        <List>
          <ListItem checked={true}>Completed task</ListItem>
          <ListItem checked={false}>Pending task</ListItem>
          <ListItem checked={false}>
            Task with <Strong>bold text</Strong>
          </ListItem>
          <ListItem>Regular list item (no checkbox)</ListItem>
        </List>
      </>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "## Task List

      - [x] Completed task
      - [ ] Pending task
      - [ ] Task with **bold text**
      - Regular list item (no checkbox)
      "
    `);
  });

  it('renders strikethrough text correctly', () => {
    const markdown = render(
      <>
        <Paragraph>
          This text has <Strikethrough>strikethrough content</Strikethrough>{' '}
          within it.
        </Paragraph>
        <Paragraph>
          You can combine{' '}
          <Strong>
            <Strikethrough>formatting styles</Strikethrough>
          </Strong>{' '}
          for more{' '}
          <Emphasis>
            <Strikethrough>complex</Strikethrough>
          </Emphasis>{' '}
          formatting.
        </Paragraph>
      </>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "This text has ~~strikethrough content~~ within it.

      You can combine **~~formatting styles~~** for more *~~complex~~* formatting.
      "
    `);
  });

  it('renders a document with all GFM features', () => {
    const markdown = render(
      <>
        <Header level={1}>GitHub Flavored Markdown Demo</Header>

        <Paragraph>
          This demo shows all GitHub Flavored Markdown features:
          <Strikethrough>strikethrough</Strikethrough>, tables and task lists.
        </Paragraph>

        <Header level={2}>Task List</Header>
        <List>
          <ListItem checked={true}>Setup project</ListItem>
          <ListItem checked={true}>Implement basic features</ListItem>
          <ListItem checked={false}>Add documentation</ListItem>
          <ListItem checked={false}>
            Release version 2.0 with{' '}
            <Strikethrough>additional features</Strikethrough> core features
            only
          </ListItem>
        </List>

        <Header level={2}>Feature Comparison</Header>
        <Table>
          <TableRow>
            <TableHeader>Feature</TableHeader>
            <TableHeader align="center">Supported</TableHeader>
            <TableHeader align="right">Since Version</TableHeader>
          </TableRow>
          <TableRow>
            <TableCell>Basic Markdown</TableCell>
            <TableCell align="center">✅</TableCell>
            <TableCell align="right">1.0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tables</TableCell>
            <TableCell align="center">✅</TableCell>
            <TableCell align="right">2.0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Task Lists</TableCell>
            <TableCell align="center">✅</TableCell>
            <TableCell align="right">2.0</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Strikethrough>Strikethrough</Strikethrough>
            </TableCell>
            <TableCell align="center">✅</TableCell>
            <TableCell align="right">2.0</TableCell>
          </TableRow>
        </Table>

        <Paragraph>
          Visit our{' '}
          <Link href="https://github.com/example/repo">GitHub repository</Link>{' '}
          for more information.
        </Paragraph>
      </>
    );

    // Update snapshot to match the formatting produced by mdast-util-to-markdown with GFM
    expect(markdown).toMatchInlineSnapshot(`
      "# GitHub Flavored Markdown Demo

      This demo shows all GitHub Flavored Markdown features:~~strikethrough~~, tables and task lists.

      ## Task List

      - [x] Setup project
      - [x] Implement basic features
      - [ ] Add documentation
      - [ ] Release version 2.0 with ~~additional features~~ core features only

      ## Feature Comparison

      | Feature           | Supported | Since Version |
      | ----------------- | :-------: | ------------: |
      | Basic Markdown    |     ✅     |           1.0 |
      | Tables            |     ✅     |           2.0 |
      | Task Lists        |     ✅     |           2.0 |
      | ~~Strikethrough~~ |     ✅     |           2.0 |

      Visit our [GitHub repository](https://github.com/example/repo) for more information.
      "
    `);
  });
});
