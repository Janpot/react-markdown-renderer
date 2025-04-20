import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, Paragraph, List, ListItem, Strong } from '../src';

describe('Nested Lists Rendering', () => {
  it('renders mixed unordered and ordered nested lists with proper indentation', () => {
    const markdown = render(
      <>
        <List>
          <ListItem>
            <Strong>Top level bullet</Strong>
            <List ordered={true}>
              <ListItem>First numbered sub-item</ListItem>
              <ListItem>
                Second numbered sub-item
                <List>
                  <ListItem>Nested bullet under numbered item</ListItem>
                  <ListItem>Another nested bullet</ListItem>
                </List>
              </ListItem>
            </List>
          </ListItem>
          <ListItem>Another top level bullet</ListItem>
        </List>
      </>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "- **Top level bullet**
        1. First numbered sub-item
        2. Second numbered sub-item
           - Nested bullet under numbered item
           - Another nested bullet
      - Another top level bullet
      "
    `);
  });

  it('handles multi-paragraph list items with nested lists', () => {
    const markdown = render(
      <>
        <List>
          <ListItem>
            <Paragraph>First paragraph in list item</Paragraph>
            <Paragraph>Second paragraph in the same list item</Paragraph>
            <List>
              <ListItem>A nested list item</ListItem>
            </List>
          </ListItem>
        </List>
      </>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "- First paragraph in list item

        Second paragraph in the same list item
        - A nested list item
      "
    `);
  });

  it('preserves text content before and after nested lists', () => {
    const markdown = render(
      <>
        <List>
          <ListItem>
            Text before the nested list
            <List>
              <ListItem>Nested item</ListItem>
            </List>
            Text after the nested list
          </ListItem>
        </List>
      </>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "- Text before the nested list
        - Nested item
        Text after the nested list
      "
    `);
  });
});
