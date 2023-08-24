import { OpenAPIRoute, Path, Str } from '@cloudflare/itty-router-openapi';
import { ICreateProduct } from '../services/product.model';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

// create FetchProduct route
export class FetchProduct extends OpenAPIRoute {
  // validate
  static schema = {
    tags: ['Products'],
    summary: 'Get a single Product',
    responses: {
      '200': {
        schema: {
          id: 1,
          title: 'my product',
          tags: 'my tags',
          created_at: '2012-02-15T15:12:21-05:00',
          updated_at: '2012-08-24T14:01:47-04:00',
          sku: 'IPOD2008PINK',
        },
      },
    },
  };

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    try {
      const productURL =
        'https://run.mocky.io/v3/d9138d51-6d11-4682-8068-d1217716fdbf';
      const response = await fetch(productURL);
      const product: ICreateProduct = await response.json();
      const result = await productService.create(product);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(err.message, {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}

export class CreateProducts extends OpenAPIRoute {
  static schema = {
    tags: ['Products'],
    summary: 'Post multiple products',
    responses: {
      '200': {
        schema: [
          {
            id: 1,
            title: 'my product',
            tags: 'my tags',
            created_at: '2012-02-15T15:12:21-05:00',
            updated_at: '2012-08-24T14:01:47-04:00',
            sku: 'IPOD2008PINK',
          },
        ],
      },
    },
  };
  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    try {
      const productsURL =
        'https://run.mocky.io/v3/d1d9c2f3-966c-46b8-9814-94b08cfe2812';
      const response = await fetch(productsURL);
      const { products } = await response.json();
      const productService = new ProductService();
      const result = await productService.bulkCreate(products);

      //const productService = new ProductService();

      //const result = await productService.create(prodList);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(err.message, {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}
