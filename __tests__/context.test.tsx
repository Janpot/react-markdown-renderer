import { describe, it, expect } from 'vitest';
import React, { createContext, useContext } from 'react';
import { render, Document, Paragraph, Strong, Emphasis, List, ListItem, Header } from '../src';

// Create a documentation version context
const VersionContext = createContext('1.0.0');

// Create a component that conditionally renders content based on version
const VersionedContent = ({ minVersion, children }: { minVersion: string, children: React.ReactNode }) => {
  const version = useContext(VersionContext);
  
  // Simple version comparison (only works for semver with same number of segments)
  const isAvailable = version.localeCompare(minVersion, undefined, { numeric: true }) >= 0;
  
  if (!isAvailable) {
    return <Paragraph><Emphasis>This feature is available in version {minVersion} and later.</Emphasis></Paragraph>;
  }
  
  return <>{children}</>;
};

// Create a component that shows version metadata
const VersionInfo = () => {
  const version = useContext(VersionContext);
  return (
    <Paragraph>
      <Strong>Documentation for version:</Strong> {version}
    </Paragraph>
  );
};

describe('React Context Support', () => {
  it('properly handles context values in components', () => {
    const markdown = render(
      <Document>
        <Header level={1}>API Documentation</Header>
        <VersionInfo />
        <VersionedContent minVersion="1.0.0">
          <Paragraph>This feature is available in the current version.</Paragraph>
        </VersionedContent>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# API Documentation

      **Documentation for version:** 1.0.0

      This feature is available in the current version.
      "
    `);
  });

  it('conditionally renders content based on version context', () => {
    const markdown = render(
      <Document>
        <VersionContext.Provider value="0.9.0">
          <Header level={1}>API Documentation</Header>
          <VersionInfo />
          <Paragraph>Basic features:</Paragraph>
          <VersionedContent minVersion="0.8.0">
            <List>
              <ListItem>Feature A</ListItem>
              <ListItem>Feature B</ListItem>
            </List>
          </VersionedContent>
          <Paragraph>Advanced features:</Paragraph>
          <VersionedContent minVersion="1.0.0">
            <List>
              <ListItem>Feature C</ListItem>
              <ListItem>Feature D</ListItem>
            </List>
          </VersionedContent>
        </VersionContext.Provider>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# API Documentation

      **Documentation for version:** 0.9.0

      Basic features:

      - Feature A
      - Feature B

      Advanced features:

      *This feature is available in version 1.0.0 and later.*
      "
    `);
  });

  it('supports nested context providers', () => {
    const markdown = render(
      <Document>
        <VersionContext.Provider value="1.0.0">
          <Header level={1}>API Documentation</Header>
          <VersionInfo />
          <Paragraph>Standard features:</Paragraph>
          <List>
            <ListItem>Feature A</ListItem>
            <ListItem>Feature B</ListItem>
          </List>
          
          <Header level={2}>Beta Features</Header>
          <VersionContext.Provider value="1.2.0-beta">
            <VersionInfo />
            <Paragraph>Preview of upcoming features:</Paragraph>
            <List>
              <ListItem>Beta Feature X</ListItem>
              <ListItem>Beta Feature Y</ListItem>
            </List>
          </VersionContext.Provider>
        </VersionContext.Provider>
      </Document>
    );

    expect(markdown).toMatchInlineSnapshot(`
      "# API Documentation

      **Documentation for version:** 1.0.0

      Standard features:

      - Feature A
      - Feature B

      ## Beta Features

      **Documentation for version:** 1.2.0-beta

      Preview of upcoming features:

      - Beta Feature X
      - Beta Feature Y
      "
    `);
  });
});