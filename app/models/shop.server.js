import fs from 'fs';
import path from 'path';

/*
 * Get themes for the current shop
 */
export async function getThemes(graphql) {

    const response = await graphql(
        `query GetThemes {
            themes(first: 10) {
              edges {
                node {
                  id
                  name
                  role
                  createdAt
                  updatedAt
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }`
      );
    
      const {
        data: { themes },
      } = await response.json();

      let clean_themes = [];

      for(var x=0; x<themes.edges.length; x++) {

        clean_themes.push({ id: themes.edges[x].node.id, name: themes.edges[x].node.name, role: themes.edges[x].node.role });

      }

      return clean_themes;
}

/*
 * Save the section to the theme
 */
export async function getSrcDoc(type, section) {

  // get section
  var section_loc = path.resolve(`app/data/${type}s/${section}/demo.html`);

  // get section
  var content = fs.readFileSync(section_loc, 'utf8');

  // escape html
  content = content.replaceAll('"', "'");

  return content;

}

/*
 * Save the section to the theme
 */
export async function saveSection(section, name, isDemo, themeId, graphql) {

  var isDemo = (isDemo === 'true');
  var filename = '';

  // get sections.json
  var sections_loc = path.resolve(`app/data/sections.json`);

  // get section
  var sections = fs.readFileSync(sections_loc, 'utf8');
  var json = JSON.parse(sections);

  // get filename
  for(var x=0; x<json.length; x++) {
    if(json[x].id == section) {
      filename = json[x].file;
    }
  }

  // get content from file
  var section_loc = path.resolve(`app/data/sections/${section}/section.liquid`);

  // get section
  var content = fs.readFileSync(section_loc, 'utf8');
  
  // replace name
  content = content.replaceAll("{{name}}", name);
  content = content.replaceAll("{{ name }}", name);

  filename = `sections/${filename}`;
  content = content.replaceAll('"', '\\"');

  // save the section
  const response = await graphql(
    `mutation UpdateThemeSection {
      themeFilesUpsert(
        files: [{
          body: {
            type: TEXT, # or BASE64, URL depending on your content format
            value: "${content}"
          },
          filename: "${filename}"
        }],
        themeId: "${themeId}"
      ) {
        job {
          done
          id
        }
        upsertedThemeFiles {
          filename
        }
        userErrors {
          code
          field
          message
        }
      }
    }`
  );

}

/*
 * Save the section to the theme
 */
export async function createOneTimeCharge(section, shop, graphql) {

  var shopName = shop.replace('.myshopify.com','');

  var returnUrl = `https://admin.shopify.com/store/${shopName}/apps/${process.env.APP_NAME}/app?shop=${shopName}&plan=buy-once&section=${section}`;

  var chargeName = process.env.SHOPIFY_CHARGE_NAME;
  chargeName += ` - Section (ID: ${section.toUpperCase()})`;

  // set test charge
  var test = false;
  if(process.env.APP_ENV == 'development') { test = true; }

  var price = 25.0;

  const variables = {
    "name": chargeName,
    "test": test,
    "returnUrl": returnUrl,
    "price": {
      "amount": price,
      "currencyCode": "USD"
    }
  };

  // get charge
  const response = await graphql(
    `#graphql
      mutation AppPurchaseOneTimeCreate($name: String!, $test: Boolean!, $price: MoneyInput!, $returnUrl: URL!) {
      appPurchaseOneTimeCreate(name: $name, test: $test, returnUrl: $returnUrl, price: $price) {
        userErrors {
          field
          message
        }
        appPurchaseOneTime {
          createdAt
          id
        }
        confirmationUrl
      }
    }`, { variables: variables });

  const data = await response.json();

  return data.data.appPurchaseOneTimeCreate.confirmationUrl;

}

/*
 * Save the section to the theme
 */
export async function createRecurringCharge(shop, plan, graphql) {

  var shopName = shop.replace('.myshopify.com','');

  var returnUrl = `https://admin.shopify.com/store/${shopName}/apps/${process.env.APP_NAME}/app?shop=${shopName}&plan=${plan}`;

  var chargeName = process.env.SHOPIFY_CHARGE_NAME;

  // set test charge
  var test = false;
  if(process.env.APP_ENV == 'development') { test = true; }

  var price = 99.0;
  var interval = 'ANNUAL';

  if(plan == 'premium-mo') {
      price = 15.0;
      interval = 'EVERY_30_DAYS';
      chargeName += ' (MONTHLY)';
  }

  const variables = {
      "name": chargeName,
      "test": test,
      "returnUrl": returnUrl,
      "trialDays": 2,
      "lineItems": [
        {
          "plan": {
            "appRecurringPricingDetails": {
              "price": {
                "amount": price,
                "currencyCode": "USD"
              },
              "interval": interval
            }
          }
        }
      ]
    }


  // get charge
  const response = await graphql(
    `#graphql
      mutation AppSubscriptionCreate($name: String!, $test: Boolean!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int!) {
                appSubscriptionCreate(name: $name, test: $test, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays) {
                  userErrors {
                    field
                    message
                  }
                  appSubscription {
                    id
                  }
                  confirmationUrl
                }
              }`, { variables: variables });

  const data = await response.json();

  return data.data.appSubscriptionCreate.confirmationUrl;

}

/*
 * Save the section to the theme
 */
export async function setAppMetafield(appInstallationId, isPremium, graphql) {

  const variables = {
    "metafieldsSetInput": [
        {
        "namespace": "sectionspro",
        "key": "premium",
        "type": "boolean",
        "value": `${isPremium}`,
        "ownerId": `${appInstallationId}`
        }
    ]
  };

  // get charge
  const response = await graphql(
    `#graphql
      mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
                metafieldsSet(metafields: $metafieldsSetInput) {
                  metafields {
                    id
                    namespace
                    key
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }`, { variables: variables });

  const data = await response.json();

  return data;

}

/*
 * Get themes for the current shop
 */
export async function getAppInstallationId(graphql) {

  const response = await graphql(
      `query getAppInstallationId { currentAppInstallation {id} }`
    );
  
    let data = await response.json();

    return data.data.currentAppInstallation.id;
}

/*
 * Get themes for the current shop
 */
export async function getSubscriptions(appInstallationId, graphql) {

  const response = await graphql(
      `query GetActiveAppSubscriptions {
        appInstallation(id: "${appInstallationId}") {
          activeSubscriptions {
            id
            name
            status
            currentPeriodEnd
            trialDays
          }
        }
      }`
    );
  
    let data = await response.json();

    return data.data.appInstallation.activeSubscriptions;
}

/*
 * Cancel existing plans
 */
export async function cancelSubscription(id, graphql) {

  const response = await graphql(
    `mutation CancelAppSubscription {
      appSubscriptionCancel(id: "${id}", prorate: true) {
        userErrors {
          field
          message
        }
        appSubscription {
          id
          status
        }
      }
    }`
  );

  let data = await response.json();

  return data;
}
