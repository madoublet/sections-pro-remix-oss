import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: 'us-east-1' }); // Replace 'your-region' with your actual AWS region

/*
 * Get the shop for the theme
 */
export async function getShop(shop) {

  // remove .myshopify.com
  shop = shop.replace('.myshopify.com','');

  // set params
  let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${shop}/shop.json`
  };

  try {
    const { Body } = await s3Client.send(new GetObjectCommand(params));

    let json = JSON.parse(await Body.transformToString());

    return json;
  }
  catch(err) {
      console.log('[no shop]', err);

      let s = { shop: shop, plan: 'free', sections: [] };

      // create the shop
      await updateShop(shop, s);

      return s;
  }
}

/*
 * Save the installed sections
 */
export async function saveInstalled(shop, section) {

  // remove .myshopify.com
  shop = shop.replace('.myshopify.com','');

  // get shop
  var s = await getShop(shop);
  
  // get existing installations
  var installed = s.installed || [];

  // add section to installed list
  if(!installed.includes(section)) installed.push(section);

  // save installed
  s.installed = installed;
  
  // save shop
  await updateShop(shop, s);
  
}


/*
 * Update the shop in S3
 */
export async function updateShop(shop, s) {

  // remove .myshopify.com
  shop = shop.replace('.myshopify.com','');

  // Set parameters
  const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${shop}/shop.json`,
      Body: JSON.stringify(s),
      ContentType: "application/json",
  };

  try {
      // Create the command
      const command = new PutObjectCommand(params);

      // Send the command to S3
      const response = await s3Client.send(command);
      console.log("Success", response);

  } catch (err) {
    console.log(err);
  }

  return;
}