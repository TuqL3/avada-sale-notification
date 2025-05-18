import {getNotificationsByDomain} from '@functions/repositories/notificationRepo';

export const list = async ctx => {
  try {
    const {shopifyDomain} = ctx.query
    const notification = await getNotificationsByDomain(shopifyDomain)
    return (ctx.body = {
      data: notification.map(presentApiData)
    })
  }catch (e) {
    return (ctx.body = {
      data: [],
      error: e.message
    })
  }
}
