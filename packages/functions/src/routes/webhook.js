import Router from 'koa-router';
import * as webHookController from '@functions/controllers/webhookController';

const router = new Router({
  prefix: '/webhook'
})

router.post('/order/new', webHookController.listenNewOrder)

export default router
