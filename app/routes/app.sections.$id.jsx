import { json } from "@remix-run/node";
import {
  useLoaderData,
} from "@remix-run/react";
import {
  Page,
  TextField,
  Icon
} from "@shopify/polaris";
import { SearchIcon } from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { useAppBridge } from '@shopify/app-bridge-react';
import { useState, useCallback, useEffect } from 'react';

import AppCard from '../components/app-card';

import dashStylesHref from "../css/dashboard.css?url";

export const links = () => [
  { rel: "stylesheet", href: dashStylesHref },
];

import sectionsData from "../data/sections.json";

import { getShop } from "../models/aws.server";

export const loader = async ({ request, params }) => {
  var title = "Sections";
  var list = [];

  if (params.id === 'free') title = "Free Sections";
  if (params.id === 'premium') title = "Premium Sections";

  for (var x = 0; x < sectionsData.length; x++) {
    if (params.id == sectionsData[x].plan) {
      list.push(sectionsData[x]);
    }
  }

  const { admin, session } = await authenticate.admin(request);

  // get shop
  const savedShop = await getShop(session.shop);

  return json({ id: params.id, list: list, title: title, shop: session.shop, savedShop: savedShop });
};

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);

  return json({ ok: true, message: "looks good" });
}

export default function ListRoute() {
  const { id, list, title, savedShop, previewUrl } = useLoaderData();
  
  const shopify = useAppBridge();

  // State for the filtered sections and search input
  const [sections, setSections] = useState(list);
  const [textFieldValue, setTextFieldValue] = useState('');

  useEffect(() => {
    setSections(list);
    setTextFieldValue('');
  }, [list]);

  // Handle search field changes
  const handleTextFieldChange = useCallback(
    (value) => {
      setTextFieldValue(value);

      // Filter the sections list based on the search term
      const filteredSections = list.filter(section =>
        section.name.toLowerCase().includes(value.toLowerCase())
      );
      
      setSections(filteredSections);
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
      {/* Search input */}
      <div style={{ marginBottom: '10px' }}>
        <TextField
          type="search"
          value={textFieldValue}
          onChange={handleTextFieldChange}
          prefix={<Icon source={SearchIcon} tone="base" />}
          autoComplete="off"
          placeholder="Search sections"
        />
      </div>
      
      {/* Filtered sections */}
      <section className="app-grid">
        {sections.map(section => (
          <AppCard 
            id={section.id}
            title={section.name}
            description={section.description} 
            url={`/app/section/${section.id}`}
            svg={section.svg}
            plan={section.plan}
            price={`$${section.price}`}
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
