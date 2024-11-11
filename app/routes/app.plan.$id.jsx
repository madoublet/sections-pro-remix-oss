import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useSubmit,
  useActionData
} from "@remix-run/react";
import {
  Page,
  TextField,
  Icon
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useAppBridge } from '@shopify/app-bridge-react';
import { useState, useCallback, useEffect } from 'react';

import planStylesHref from "../css/plan.css?url";

export const links = () => [
  { rel: "stylesheet", href: planStylesHref },
];

import { createOneTimeCharge, createRecurringCharge, getAppInstallationId, getSubscriptions, cancelSubscription, setAppMetafield } from "../models/shop.server";
import { getShop, updateShop } from "../models/aws.server";

export const loader = async ({ request, params }) => {
  var title = "Purchase Options";
  var isBuyOnce = true;

  if(params.id == 'manage') {
    title = 'Manage Plan';
    isBuyOnce = false;
  }
 
  const { admin, session } = await authenticate.admin(request);

  // get shop
  let savedShop = await getShop(session.shop);

  return json({ id: params.id, title: title, isBuyOnce: isBuyOnce, shop: session.shop, savedShop: savedShop });
};

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);

  const formData = await request.formData();
  const section = formData.get("section");
  const plan = formData.get("plan");
  var url = '';

  // save selected plan
  let savedShop = await getShop(session.shop);
  savedShop.selectedPlan = plan;
  
  // update shop
  await updateShop(session.shop, savedShop);
  
  // generate url
  if(plan == 'buy-once') {
    url = await createOneTimeCharge(section, session.shop, admin.graphql);
  }
  else if(plan == 'free') {
    let appInstallationId = await getAppInstallationId(admin.graphql);
    let subs = await getSubscriptions(appInstallationId, admin.graphql);

    // disable app blocks
    await setAppMetafield(appInstallationId, false, admin.graphql);

    // cancel active subscription
    for(let x=0; x<subs.length; x++) {
      if(subs[x].status.toUpperCase() == 'ACTIVE') {
        cancelSubscription(subs[x].id, admin.graphql)
      }
    }

    // set free
    savedShop.plan = 'free';
    await updateShop(session.shop, savedShop);

  }
  else {
    url = await createRecurringCharge(session.shop, plan, admin.graphql);
  }

  return json({ ok: true, url: url, savedShop: savedShop });
}

export default function PlanRoute() {
  const { id, title, isBuyOnce, savedShop } = useLoaderData();
  
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData();

  let plan = savedShop.plan || 'free';

  // set current plan
  const [currentPlan, setCurrentPlan] = useState(plan);

  if(actionData) {
    if(actionData.url) {
      if(actionData.url != '') window.top.location.href = actionData.url;
    }
  }

  useEffect(() => {
    if(actionData) {
      if(actionData.savedShop) {
        if(actionData.savedShop.plan) {
          setCurrentPlan(actionData.savedShop.plan);
        }
      }
    }
  }, [actionData]);

  const submitPlan = (plan) => {
    
    const data = {
      section: id,
      plan: plan
    };

    submit(data, { method: "post" });
  
  };

  return (
    <Page
      backAction={{content: 'Plan', onAction: () => navigate(-1) }}
      title={title}
    >
      <section className="app-title">
        <p>Billed on your next invoice. We guarantee you will love your purchase or your money back.</p>
      </section>

      <div class="plan-grid">
        <button onClick={() => submitPlan('buy-once')} className={`${isBuyOnce ? '' : 'hidden'}`}>
          <h2>Purchase Section</h2>
          <p>$25</p>
          <ul>
            <li>♾️ Own Forever</li>
          </ul>
        </button>

        <button onClick={() => submitPlan('free')}className={`${isBuyOnce ? 'hidden' : ''} ${currentPlan == 'free' ? 'current' : ''}`}>
          <h2>Free Plan</h2>
          <p>&nbsp;</p>
          <ul>
            <li>🚀 50 Free Sections</li>
          </ul>
        </button>

        <button onClick={() => submitPlan('premium-mo')} className={`${currentPlan == 'premium-mo' ? 'current' : ''}`}>
          <h2>Premium Monthly</h2>
          <p>$15 / month</p>
          <ul>
            <li>⏰ 2 Day Free Trial</li>
            <li>🚀 50 Free Sections</li>
            <li>💎 50+ Premium Sections</li>
            <li>💥 10 premium blocks</li>
          </ul>
        </button>

        <button onClick={() => submitPlan('premium-yearly')} className={`${currentPlan == 'premium-yearly' ? 'current' : ''}`}>
          <h2>Premium Yearly</h2>
          <p>$99 / year</p>
          <ul>
            <li>⏰ 2 Day Free Trial</li>
            <li>💰 Save $80 over Monthly Plan</li>
            <li>🚀 50 Free Sections</li>
            <li>💎 50+ Premium Sections</li>
            <li>💥 10 premium blocks</li>
          </ul>
        </button>
      </div>

      <section className="app-title">
        <p>Email <a href="mailto:matt@matthewsmith.com">matt@matthewsmith.com</a> for any questions.</p>
      </section>


    </Page>
  );
}
