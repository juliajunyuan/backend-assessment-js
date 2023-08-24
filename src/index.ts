import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { FetchProduct, CreateProducts } from './routes/products';
export interface Env {
  DATABASE_HOST: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
}

const router = OpenAPIRouter({
  schema: {
    info: {
      title: 'Backend assessment OpenAPI',
      version: '1.0',
    },
  },
});
router.get('/api/products/', FetchProduct);
router.post('/api/products/', CreateProducts);
router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  fetch: router.handle,
};
