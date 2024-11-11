import { json } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  useSubmit,
  useNavigate,
  useLocation
} from "@remix-run/react";
import {
  Page,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useAppBridge } from '@shopify/app-bridge-react';
import { useState, useEffect } from 'react';

import previewStylesHref from "../css/preview.css?url";

export const links = () => [
  { rel: "stylesheet", href: previewStylesHref },
];

import sections from "../data/sections.json";
import AppPreview from "../components/app-preview";
import { AppPublish } from "../components/app-publish";
import { AppSuccess } from "../components/app-success";

import { saveSection, getThemes, getSrcDoc } from '../models/shop.server';
import { getShop, saveInstalled } from "../models/aws.server";

export const loader = async ({ request, params }) => {

  var section = null;
  var srcDoc = '';
  var plan = 'free';
  var price = 0;
  var title = '';
  var description = '';

  for(var x=0; x<sections.length; x++) {
    if(params.id == sections[x].id) {
      section = sections[x];
      plan = sections[x].plan;
      price = sections[x].price;
      title = sections[x].name;
      description = sections[x].description;
      srcDoc = await getSrcDoc('section', sections[x].id);
    }
  }


  const { admin, session } = await authenticate.admin(request);

  // get themes
  const themes = await getThemes(admin.graphql);

  // get shop
  const savedShop = await getShop(session.shop);
  let isPaidFor = false;

  if(plan == 'premium') {
    // check for sub and purchased
    if(savedShop) {
        if(savedShop.plan) {
            if(savedShop.plan.includes('premium')) isPaidFor = true;
        }

        if(savedShop.sections.includes(params.id)) isPaidFor = true;
    }
  }

  return json({ id: params.id, section: section, title: title, description: description, plan: plan, price: price, srcDoc: srcDoc, themes: themes, shop: session.shop, savedShop: savedShop, isPaidFor: isPaidFor });
};

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);

  const formData = await request.formData();
  const section = formData.get("section");
  const name = formData.get("name");
  const isDemo = formData.get("is_demo");
  const theme = formData.get("theme");

  // save section
  await saveSection(section, name, isDemo, theme, admin.graphql);

  // save to aws
  await saveInstalled(session.shop, section);

  // https://remix.run/docs/en/main/discussion/form-vs-fetcher
  // https://remix.run/docs/en/main/guides/data-writes
  return json({ ok: true, theme: theme });
}


export default function PreviewRoute() {
  
  const { id, section, title, description, themes, shop, savedShop, isPaidFor, srcDoc } = useLoaderData();
  const navigate = useNavigate();

  const actionData = useActionData();

  var isPublished = false;

  if(actionData) {
    isPublished = true;
  }

  const submit = useSubmit();
  const shopify = useAppBridge();
  
  const [status, setStatus] = useState('demo');
  const [currentTheme, setCurrentTheme] = useState(null);
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if(isPublished) {
      setShowPublishedModal(false); 
      setShowSuccessModal(true);
      setCurrentTheme(actionData.theme);
    }
  }, [actionData]);


  function showPublishModal(status) {
    setStatus(status);
    setShowPublishedModal(true);
    setShowSuccessModal(false);
  }

  const handlePublishCancel = () => {
    setShowPublishedModal(false);
  }

  const handleSuccessCancel = () => {
    setShowSuccessModal(false);
  }

  const handlePublish = (theme, name, status) => {
    
    var isDemo = false;
    if(status == 'demo') isDemo = true;
    
    const data = {
      section: id,
      name: name,
      theme: theme,
      is_demo: isDemo
    };

    submit(data, { method: "post" });
  
  };

  var secondary_actions = [];
  var primary_action = [];
  var primary_text = 'Publish';

  // set premium
  if(section) {
    if(section.plan == 'premium' && isPaidFor == false) {
      secondary_actions = [
        {
          content: 'Free Demo',
          onClick: () => { showPublishModal('demo'); }
        }
      ];
      primary_text = `Purchase $${section.price}`;
    }

    primary_action = {
      content: primary_text, 
      onClick: () => { 
        if(section.plan == 'premium' && isPaidFor == false) {
          navigate(`/app/plan/${section.id}`);
        }
        else showPublishModal('publish'); 
      },
      disabled: false}
  }
  
  return (
    <Page
      backAction={{content: 'Sections', onAction: () => navigate(-1) }}
      title={title}
      secondaryActions={secondary_actions}
      primaryAction={primary_action}
    >

      <p className="app-preview-description">{description}</p>

      <div className="app-preview-grid">
        <AppPreview srcDoc={srcDoc}></AppPreview>
      </div>
      
      <AppPublish isOpen={showPublishedModal} status={status} themes={themes} sectionName={title} onPublish={handlePublish} onCancel={handlePublishCancel}></AppPublish>
      <AppSuccess isOpen={showSuccessModal} shop={shop} theme={currentTheme} onCancel={handleSuccessCancel}></AppSuccess>

    </Page>

    
  );
}
