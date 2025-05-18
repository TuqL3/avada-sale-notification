import {Firestore} from '@google-cloud/firestore';
import Shopify from 'shopify-api-node';

const firestore = new Firestore();
const notifi = firestore.collection('notifications');

export async function addNewNotification({shopId, shopifyDomain, data}) {
  await notifi.add({
    shopId: shopId,
    shopifyDomain: shopifyDomain,
    ...data
  });
}

export async function getNotificationItem(shopify, orderData) {
  if (!orderData.line_items || !orderData.billing_address) return {};
  return {
    timestamp: new Date(orderData.created_at),
    firstName: orderData.billing_address.first_name,
    city: orderData.billing_address.city,
    country: orderData.billing_address.country,
    productId: orderData.line_items[0].product_id,
    productName: orderData.line_items[0].name,
    productImage: orderData.line_items.images[0].src
  };
}

export async function getNotifications({shopId, page = '1', limit = '5', sort = 'desc'}) {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const order = sort === 'asc' ? 'asc' : 'desc';

  const baseQuery = notifi.where('shopId', '==', shopId);

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

export async function syncNotifications({shopifyDomain, shopId, accessToken}) {
  const shopify = new Shopify({
    shopName: shopifyDomain,
    accessToken,
  });

  try {
    const orders = await shopify.order.list({limit: 30});
    if (!Array.isArray(orders) || orders.length === 0) return {};

    const validOrders = orders.filter(
      order =>
        order?.billing_address &&
        Array.isArray(order.line_items) &&
        order.line_items.length > 0 &&
        order.line_items[0].product_id
    );

    const tasks = validOrders.map(order => {
      const {billing_address: address, created_at, line_items} = order;
      const item = line_items[0];

      const notification = {
        timestamp: new Date(created_at),
        firstName: address.first_name,
        city: address.city,
        country: address.country,
        productName: item.name,
        productImage: item.image?.src || '',
        productId: String(item.product_id),
        shopId,
        shopifyDomain
      };

      return notifi.add(notification);
    });

    const results = await Promise.allSettled(tasks);
    const failed = results.filter(r => r.status === 'rejected');

    if (failed.length > 0) {
      console.warn(`${failed.length} notification(s) failed to sync.`);
    }

    return {success: true, failedCount: failed.length};
  } catch (err) {
    console.error('Failed to sync notifications:', err.message || err);
    throw err;
  }
}

export const getNotificationsByDomain = async (domain, limitCount = 30) => {
  try {
    const snapshot = await notifi
      .where('shopifyDomain', '==', domain)
      .orderBy('timestamp', 'desc')
      .limit(limitCount)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => {
      // eslint-disable-next-line no-unused-vars
      const {shopId, ...notificationData} = doc.data();
      return {
        id: doc.id,
        ...notificationData
      };
    });

  } catch (error) {
    console.error('Failed to fetch notifications:', error.message || error);
    return [];
  }
};
