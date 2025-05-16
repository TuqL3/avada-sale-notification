import React, {useState} from 'react';
import {BlockStack, Button, Card, InlineStack, Layout, Page, Text} from '@shopify/polaris';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Page title="Home">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <InlineStack blockAlign="center">
                <Text as="span">App status is {enabled ? 'enabled' : 'disabled'}</Text>
                <div style={{flex: 1}} />
                <Button
                  variant={enabled ? 'secondary' : 'primary'}
                  onClick={() => setEnabled(prev => !prev)}
                >
                  {enabled ? 'Disable' : 'Enable'}
                </Button>
              </InlineStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
