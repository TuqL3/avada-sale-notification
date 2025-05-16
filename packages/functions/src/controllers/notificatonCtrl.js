import {getNotifications} from '../repositories/notificationRepo';
import {getCurrentShop} from '../helpers/auth';

export async function handleGetNotifications(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const {page = '1', limit = '5', sort = 'desc'} = ctx.query;

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

// import {getNotifications} from '../repositories/notificationRepo';
// import {getCurrentShop} from '../helpers/auth';
//
// export async function handleGetNotifications(ctx) {
//   try {
//     const shopId = getCurrentShop(ctx);
//     const {page, limit, sort} = ctx.query;
//     const {count, pageInfo, notifications} = await getNotifications({shopId, page, limit, sort});
//
//     return (ctx.body = {
//       count: count,
//       pageInfo: pageInfo,
//       data: notifications,
//       success: true
//     });
//   } catch (err) {
//     ctx.status = 404;
//     return (ctx.body = {
//       data: {},
//       success: false,
//       message: err.message
//     });
//   }
// }
