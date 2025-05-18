const Shopify = require('shopify-api-node');

async () => {
  const shopify = new Shopify({
    shopName: 'elgnut.myshopify.com',
    accessToken:
      'U2FsdGVkX18uq3EQLOHJCXXOejPDChdep0AbHtxOtsbGLY+1nckos/O8RCwPoQzMF/+RrqvkGd+crL9/eNnTng=='
  });
  const scriptTags = await shopify.scriptTag.list();
  console.log(scriptTags);
};
