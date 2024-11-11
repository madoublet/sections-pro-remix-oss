import { json } from "@remix-run/node";
import {
  useLoaderData,
} from "@remix-run/react";
import {
  Page,
  TextField,
  Icon,
} from "@shopify/polaris";
import { SearchIcon } from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { useAppBridge } from '@shopify/app-bridge-react';
import { useState, useCallback, useEffect } from 'react';

import AppCard from '../components/app-card';
import AppBlockFeature from '../components/app-block-feature';

import dashStylesHref from "../css/dashboard.css?url";

export const links = () => [
  { rel: "stylesheet", href: dashStylesHref },
];

import blocksData from "../data/blocks.json";

import { getShop } from "../models/aws.server";

export const loader = async ({ request, params }) => {
  var title = "Product Blocks";

  const { admin, session } = await authenticate.admin(request);

  // get shop
  const savedShop = await getShop(session.shop);

  return json({ id: params.id, list: blocksData, title: title, shop: session.shop, savedShop: savedShop });
};

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);

  return json({ ok: true, message: "looks good" });
}

export default function ListRoute() {
  const { id, list, title, savedShop, previewUrl } = useLoaderData();
  
  const shopify = useAppBridge();

  // State for the filtered blocks and search input
  const [blocks, setBlocks] = useState(list);
  const [textFieldValue, setTextFieldValue] = useState('');

  useEffect(() => {
    setBlocks(list);
    setTextFieldValue('');
  }, [list]);

  // Handle search field changes
  const handleTextFieldChange = useCallback(
    (value) => {
      setTextFieldValue(value);

      // Filter the blocks list based on the search term
      const filteredBlocks = list.filter(block =>
        block.name.toLowerCase().includes(value.toLowerCase())
      );
      
      setBlocks(filteredBlocks);
    },
    [list],
  );
  
  return (
    <Page
      title={title}
      actionGroups={[
        {
          title: 'More actions',
          actions: [
            { content: 'Manage Plan', url: `/app/plan/manage` },
            { content: 'Support' }
          ],
        },
      ]}
    >

      <AppBlockFeature plan={savedShop.plan}></AppBlockFeature>

      <section className="app-title">
        <h2>Discover our Product Blocks</h2>
        <p>Tap below to see a preview of our product blocks. You can add blocks from the Shopify theme customizer.</p>
      </section>

      {/* Search input */}
      <div style={{ marginBottom: '10px' }}>
        <TextField
          type="search"
          value={textFieldValue}
          onChange={handleTextFieldChange}
          prefix={<Icon source={SearchIcon} tone="base" />}
          autoComplete="off"
          placeholder="Search blocks"
        />
      </div>
      
      {/* Filtered blocks */}
      <section className="app-grid">
        {blocks.map(block => (
          <AppCard 
            id={block.id}
            title={block.name}
            description={block.description} 
            url={`/app/block/${block.id}`}
            svg={block.svg}
            plan='premium'
            price='Requires Subscription'
            savedShop={savedShop}
          />
        ))}
      </section>

      <section className="app-title">
        <p>Need more help? We have amazing video tutorials or <a href="mailto:matt@matthewsmith.com">get in touch</a>.</p>
      </section>
    </Page>
  );
}
