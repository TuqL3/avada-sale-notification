import {Firestore} from '@google-cloud/firestore';
import {getOrders} from '@functions/services/getOrder';

/**
 * @documentation
 *
 * Only use one repository to connect to one collection
 * do not connect more than one collection from one repository
 */
const firestore = new Firestore();
/** @type CollectionReference */
const notificationsRef = firestore.collection('notifications');

/**
 * @param {string} shopId
 * @param {string} shopifyDomain
 * @param {Object} data
 * @returns {Object}
 */
export async function addNewNotification({shopId, shopifyDomain, data}) {
  await notificationsRef.add({
    ...data,
    shopId: shopId,
    shopifyDomain: shopifyDomain
  });
}

/**
 *
 * @param {Shopify} shopify
 * @param {Object} orderData
 * @returns {Object}
 */
export async function getNotificationItem(shopify, orderData) {
  if (!orderData) return {};

  const line_items = orderData.line_items;
  const billing_address = orderData.billing_address;

  if (!line_items || !billing_address) return {};

  const productWithId = await shopify.product.get(line_items[0].product_id);

  if (!productWithId || !productWithId.images) return {};

  const notification = {
    timestamp: new Date(orderData.created_at),
    firstName: billing_address.first_name,
    city: billing_address.city,
    country: billing_address.country,
    productId: line_items[0].product_id,
    productName: line_items[0].name,
    productImage: productWithId.images[0].src
  };

  return notification;
}

/**
 *
 * @param {string} shopId
 * @param {string} page
 * @param {string} limit
 * @param {string} sort
 * @returns {Object}
 */

export async function getNotifications({shopId, page = '1', limit = '5', sort = 'desc'}) {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const order = sort === 'asc' ? 'asc' : 'desc';

  const baseQuery = notificationsRef.where('shopId', '==', shopId);

  const countSnapshot = await baseQuery.get();
  const count = countSnapshot.size;

  const notificationsSnapshot = await baseQuery
    .orderBy('timestamp', order)
    .offset((pageNum - 1) * limitNum)
    .limit(limitNum)
    .get();

  if (notificationsSnapshot.empty) {
    return {
      count,
      total: count,
      pageInfo: {
        page: pageNum,
        limit: limitNum,
        sort,
        hasPre: pageNum > 1,
        hasNext: false
      },
      notifications: []
    };
  }

  const notifications = notificationsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const hasNext = pageNum * limitNum < count;
  const hasPre = pageNum > 1;

  const pageInfo = {
    page: pageNum,
    limit: limitNum,
    sort,
    hasPre,
    hasNext
  };

  return {
    count: notifications.length,
    total: count,
    pageInfo,
    notifications
  };
}

// export async function getNotifications({shopId, page = '1', limit = '5', sort = 'desc'}) {
//   const baseQuery = notificationsRef.where('shopId', '==', shopId);
//   const countRef = baseQuery.get();
//   const paginateNotifications = baseQuery
//     .orderBy('timestamp', sort === 'asc' ? 'asc' : 'desc')
//     .limit(parseInt(limit))
//     .offset((parseInt(page) - 1) * parseInt(limit))
//     .get();
//   const [countSnapshot, notificationsSnapshot] = await Promise.all([
//     countRef,
//     paginateNotifications
//   ]);
//
//   if (countRef.empty || paginateNotifications.empty) {
//     return null;
//   }
//   const count = countSnapshot.size;
//   const notifications = notificationsSnapshot.docs.map(doc => {
//     return {
//       ...doc.data(),
//       id: doc.id
//     };
//   });
//   const pageInfo = {
//     page: parseInt(page),
//     limit: parseInt(limit),
//     sort
//   };
//
//   return {count, pageInfo, notifications};
// }

/**
 *
 * @param {string} shopifyDomain
 * @param {string} shopId
 * @param {string} accessToken
 * @returns
 */
export async function syncNotifications({shopifyDomain, shopId, accessToken}) {
  const response = await getOrders(shopifyDomain, accessToken);

  if (!response.orders.edges) return {};

  const orders = response.orders.edges.map(item => {
    if (!item.node) return {};

    const nodeItem = item.node;
    const billingAddress = nodeItem.billingAddress;
    const lineItems = nodeItem.lineItems;
    const lineItemsNode = lineItems.edges[0].node;

    if (!billingAddress || !lineItems || !lineItemsNode) return {};

    const productID = lineItemsNode.product.id.split('/').pop();

    const notification = {
      timestamp: new Date(nodeItem.createdAt),
      firstName: billingAddress.firstName,
      city: billingAddress.city,
      country: billingAddress.country,
      productName: lineItemsNode.name,
      productImage: lineItemsNode.product.featuredImage.url,
      productId: productID,
      shopId: shopId,
      shopifyDomain: shopifyDomain
    };
    return notificationsRef.add(notification);
  });
  await Promise.all(orders);
}

/**
 *
 * @param {string} shopifyDomain
 * @returns {Object}
 */
export const getNotificationsByDomain = async (shopifyDomain, maxPopsDisplay = 30) => {
  const notificationsDocs = await notificationsRef
    .where('shopifyDomain', '==', shopifyDomain)
    .orderBy('timestamp', 'desc')
    .limit(maxPopsDisplay)
    .get();
  if (notificationsDocs.empty) {
    return null;
  }
  const notifications = notificationsDocs.docs.map(doc => {
    return {
      ...doc.data(),
      id: doc.id
    };
  });

  const notificationsHidedShopId = notifications.map(notification => {
    return Object.fromEntries(Object.entries(notification).filter(([key]) => key !== 'shopId'));
  });

  return notificationsHidedShopId;
};

/**
 *
 * @param {string} shopId
 */
export async function deleteNotifications(shopId) {
  const notificationDocs = await notificationsRef.where('shopId', '==', shopId).get();
  if (notificationDocs.empty) {
    return;
  }
  const notificationIds = notificationDocs.docs.map(doc => doc.id);
  await Promise.all(notificationIds.map(id => notificationsRef.doc(id).delete()));
}
