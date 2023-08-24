import { IProduct, ICreateProduct } from './product.model';
import { Client } from '@planetscale/database';

// setup connection to Planetscale database
const config = {
  host: 'aws.connect.psdb.cloud',
  username: 'r3mksd6m10mymbnfjxlw',
  password: 'pscale_pw_APAO6UgrVBcRAx7Q9WSweGhQn4OsjhmgbO51p2Cc6Hf',
};
const client = new Client(config);
const connection = client.connection();

export class ProductService {
  async create(productRawData: ICreateProduct) {
    const {
      id,
      title: prodTitle,
      tags,
      created_at,
      updated_at,
      variants,
    } = productRawData;
    const { title: variantTitle, sku } = variants[0];
    const title = prodTitle + ' ' + variantTitle;
    const newProduct: IProduct = {
      id,
      title,
      tags,
      created_at,
      updated_at,
      sku,
    };

    // check if the id exists in database already
    const { rows: productInDB } = await connection.execute(
      `SELECT * FROM products WHERE ID = ${newProduct.id}`
    );
    if (productInDB) {
      throw Error(
        `product with the same product_id ${id} already exists in Database: ${JSON.stringify(
          newProduct
        )}`
      );
    }

    // insert new product to database
    const { rows } = await connection.execute(
      'INSERT INTO products (id, title, tags, created_at, updated_at, sku) VALUES (?, ?, ?, ?, ?, ?)',
      Object.values(newProduct)
    );
    return newProduct;
  }
  async bulkCreate(products: ICreateProduct[]) {
    const productsList = products.reduce((accum, product) => {
      const {
        id,
        title: prodTitle,
        tags,
        created_at,
        updated_at,
        variants,
      } = product;
      // generate new title with different variant value
      variants?.forEach((variant) => {
        accum.push({
          // generate a new value for id to prevent id duplication in db
          id: id + variant.id,
          title: prodTitle + ' ' + variant.title,
          tags,
          created_at,
          updated_at,
          sku: variant.sku,
        });
      });
      return accum;
    }, [] as IProduct[]);

    const { rows: productsInDB } = await connection.execute(
      'SELECT * FROM products'
    );
    // check if there is duplicated product id in db
    const idExists = productsList.some((product) => {
      const idArrInDB = (productsInDB as IProduct[]).map(
        (prodInDB) => prodInDB.id
      );
      return idArrInDB.includes(product.id);
    });

    // insert multiple products to database
    const results = productsList.map(async (newProduct) => {
      await connection.execute(
        'INSERT INTO products (id, title, tags, created_at, updated_at, sku) VALUES (?, ?, ?, ?, ?, ?)',
        Object.values(newProduct)
      );
    });
    await Promise.all(results);
    return productsList;
  }
}
