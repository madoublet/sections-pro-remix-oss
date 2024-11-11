import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate, 
  Link
} from "@remix-run/react";
import {
  Page,
} from "@shopify/polaris";

import AppCard from '../components/app-card';
import AppStatCard from '../components/app-stat-card';
import AppFeature from '../components/app-feature';

import dashStylesHref from "../css/dashboard.css?url";

import featuredFree from "../data/featured-free.json";
import featuredPremium from "../data/featured-premium.json";

export const links = () => [
  { rel: "stylesheet", href: dashStylesHref },
];

import { authenticate } from "../shopify.server";
import { getShop, updateShop } from "../models/aws.server";
import { getAppInstallationId, setAppMetafield } from "../models/shop.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  const savedShop = await getShop(session.shop);

  const url = new URL(request.url);
  const chargeId = url.searchParams.get("charge_id") || "";
  const plan = url.searchParams.get("plan") || "";
  const section = url.searchParams.get("section") || "";

  if(chargeId != '') {

    var sections = savedShop.sections || [];

    // handle buy once sections
    if(savedShop.selectedPlan == 'buy-once') {

      // push purchased section
      if(!sections.includes(section)) sections.push(section);
      savedShop.sections = sections;

      // save shop
      await updateShop(session.shop, savedShop);
    }
    else {

      // set to active
      savedShop.plan = savedShop.selectedPlan;
      savedShop.status = 'active';
      savedShop.chargeId = chargeId;

      // enable app blocks
      let appInstallationId = await getAppInstallationId(admin.graphql)
      await setAppMetafield(appInstallationId, true, admin.graphql);

      // save shop
      await updateShop(session.shop, savedShop);
    }

  }

  return json({ shop: session.shop.replace(".myshopify.com", ""), featuredFree: featuredFree, featuredPremium: featuredPremium, savedShop: savedShop });
};

export async function action({ request }) {
 
}

export default function Index() {
  
  const { shop, sections, savedShop } = useLoaderData();
  const navigate = useNavigate();


  return (
    <Page
      title="Dashboard"
      actionGroups={[
        {
          title: 'More actions',
          actions: [
            {content: 'Manage Plan', url: `/app/plan/manage` },
            {content: 'Help', url: '/app/help'},
          ],
        },
      ]}
    >
      <AppFeature></AppFeature>

      <section className="app-title">
        <h2>Get Started with our Free Sections</h2>
        <p>Select one of our sections to get started.  <Link to="/app/sections/free">View our Free Sections</Link></p>
      </section>

      <section className="app-grid">
        
          {featuredFree.map(section => (
            <AppCard 
              id={section.id}
              title={section.name}
              description={section.description} 
              url={`/app/section/${section.id}`}
              svg={section.svg}
              plan={section.plan}
              price={`${section.price}`}
              savedShop={savedShop}></AppCard>
          ))}

      </section>

      <section className="app-title">
        <h2>Get Creative with Premium Sections!</h2>
        <p>Need a more robust solution? Our premium sections have you covered. <Link to="/app/sections/premium">View our Premium Sections</Link></p>
      </section>

      <section className="app-grid">
        
          {featuredPremium.map(section => (
            <AppCard 
              id={section.id}
              title={section.name}
              description={section.description} 
              url={`/app/section/${section.id}`}
              svg={section.svg}
              plan={section.plan}
              price={`${section.price}`}
              savedShop={savedShop}></AppCard>
          ))}

      </section>

      <section className="app-title">
        <h2>Stay up to Date</h2>
        <p>Keep up to date with Sections Pro with our key stats.</p>
      </section>

      <section className="app-grid">
        <AppStatCard 
          title="Total Sections Installed"
          stat="59"></AppStatCard>
      
        <AppStatCard 
          title="Free Sections Available"
          stat="50"></AppStatCard>

        <AppStatCard 
          title="Premium Sections Available"
          stat="56"></AppStatCard>
      </section>

      <section className="app-title">
        <p>Need more help? We have amazing video tutorials or <a href="mailto:matt@matthewsmith.com">get in touch</a>.</p>
      </section>
 
    </Page>
  );
}
