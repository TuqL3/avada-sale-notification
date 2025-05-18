import {getShopByShopifyDomain} from '@avada/core';
import Shopify from 'shopify-api-node';
import {addNewNotification, getNotificationItem} from '@functions/repositories/notificationRepo';

export const listenNewOrder = async ctx => {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const orderData = ctx.req.body;
    const shop = await getShopByShopifyDomain(shopifyDomain);
    const shopify = new Shopify({
      shopName: shopifyDomain,
      accessToken: shop.accessToken
    })
    const notification = await getNotificationItem(shopify, orderData);
    await addNewNotification({shopId: shop.uid, shopifyDomain, data: notification})

    return (ctx.body = {
      success: true
    })
  } catch (e){
    console.log(e);
  }
  return (ctx.body = {
    success: false
  })
}
