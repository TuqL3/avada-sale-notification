import Router from 'koa-router';
import * as clientApiController from '@functions/controllers/clientController';

const router = new Router({
  prefix: '/clientApi'
})

router.post('/', clientApiController.list)

export default router
