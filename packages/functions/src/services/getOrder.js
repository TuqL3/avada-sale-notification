import Shopify from 'shopify-api-node';

/**
 *
 * @param {string} shopifyDomain
 * @param {string} accessToken
 * @returns
 */
export async function getOrders(shopifyDomain, accessToken) {
  const shopify = new Shopify({
    shopName: shopifyDomain,
    accessToken: accessToken
  });
  const graphQlQuery = `{
    orders(first:30,sortKey:CREATED_AT,reverse:true) {
      edges{
        node{
          createdAt
          billingAddress{
            firstName
            city
            country
          }
          lineItems(first:1){
            edges{
              node{
                name
                product {
                  id
                  featuredImage{
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
  const response = await shopify.graphql(graphQlQuery);
  return response;
}
