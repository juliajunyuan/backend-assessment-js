export interface IProduct {
  id: string;
  title: string;
  tags: string;
  created_at: Date;
  updated_at: Date;
  sku: string;
}

type Variant = {
  id?: string;
  title: string;
  sku: string;
};
export interface ICreateProduct extends IProduct {
  variants: Variant[];
}
