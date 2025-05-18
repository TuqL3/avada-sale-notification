import {getNotifications} from '../repositories/notificationRepo';
import {getCurrentShop} from '../helpers/auth';

export async function handleGetNotifications(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    // const shopId = 'm0veLlBS9keS3GzxvzMJROGvQdB2'
    const {page = '1', limit = '10', sort = 'asc'} = ctx.query;

    const {count, total, pageInfo, notifications} = await getNotifications({
      shopId,
      page,
      limit,
      sort
    });

    ctx.body = {
      data: notifications,
      count,
      total,
      pageInfo,
      success: true
    };
  } catch (err) {
    ctx.status = 404;
    ctx.body = {
      data: [],
      count: 0,
      total: 0,
      pageInfo: {},
      success: false,
      message: err.message
    };
  }
}
