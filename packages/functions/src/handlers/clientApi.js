import App from 'koa';
import router from '@functions/routes/clientApi';

const api = new App();
api.proxy = true

api.use(router.allowedMethods())
api.use(router.routes())

api.on('error', err => {
  console.error(err);
});

export default api
