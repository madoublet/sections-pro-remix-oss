import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  Page,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import previewStylesHref from "../css/preview.css?url";

export const links = () => [
  { rel: "stylesheet", href: previewStylesHref },
];

import blocks from "../data/blocks.json";
import AppPreview from "../components/app-preview";

import { getSrcDoc } from '../models/shop.server';
import { getShop } from "../models/aws.server";

export const loader = async ({ request, params }) => {

  var block = null;
  var plan = 'free';
  var price = 0;
  var title = '';
  var description = '';
  var srcDoc = '';

  for(var x=0; x<blocks.length; x++) {
    if(params.id == blocks[x].id) {
      block = blocks[x];
      plan = blocks[x].plan;
      price = blocks[x].price;
      title = blocks[x].name;
      description = blocks[x].description;
      srcDoc = await getSrcDoc('block', blocks[x].id);
    }
  }
  

  const { admin, session } = await authenticate.admin(request);

  // get shop
  const savedShop = await getShop(session.shop);

  return json({ id: params.id, block: block, title: title, description: description, srcDoc: srcDoc, shop: session.shop, savedShop: savedShop });
};

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);

  return json({ ok: true });
}


export default function PreviewRoute() {
  
  const { title, description, srcDoc } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page
      backAction={{content: 'Blocks', onAction: () => navigate(-1) }}
      title={title}
    >

      <p className="app-preview-description">{description}</p>

      <div className="app-preview-grid">
        <AppPreview srcDoc={srcDoc}></AppPreview>
      </div>

    </Page>
  );
}
