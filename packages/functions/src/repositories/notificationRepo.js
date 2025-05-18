import {Firestore} from '@google-cloud/firestore';
import Shopify from 'shopify-api-node';

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
  const shopify = new Shopify({
    shopName: shopifyDomain,
    accessToken
  });

  try {
    const orders = await shopify.order.list({limit: 30});

    if (!orders || orders.length === 0) return {};

    const tasks = orders.map(order => {
      const Address = order.billing_address;
      const Items = order.line_items;
      const firstItem = Items[0];

      if (!Address || !firstItem || !firstItem.product_id) return;

      const notification = {
        timestamp: new Date(order.created_at),
        firstName: Address.first_name,
        city: Address.city,
        country: Address.country,
        productName: firstItem.name,
        productImage: firstItem.image ? firstItem.image.src : '',
        productId: firstItem.product_id.toString(),
        shopId,
        shopifyDomain
      };

      return notificationsRef.add(notification);
    });

    await Promise.all(tasks);
  } catch (err) {
    console.error(err);
    throw err;
  }
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
