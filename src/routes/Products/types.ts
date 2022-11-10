import { Provider } from '../Providers/types';

interface IProductsProviderContextData {
  products: Product[];
  changePage: (page: number) => void;
  pages: number;
  editProduct: (product: Product) => void;
  editProductById: (productId: string, readOnly?: boolean) => void;
  showForm: boolean;
  toggleShowForm: (open: boolean, readOnly?: boolean) => void;
  productEditing: null | Product;
  createProduct: (productInput: CreateProductData) => Promise<void>;
  confirmEditProduct: (
    productInput: CreateProductData,
    id: string,
  ) => Promise<void>;
  incativateProduct: (productId: string) => void;
  providers: Provider[];
  onSearch: (search: string) => void;
  search: string;
  readOnlyForm: boolean;
}

export type Product = {
  id: string;
  providerId: string;
  name: string;
  description: string;
  paidPrice: number;
  salePrice: number;
  qntd: number;
};

export type CreateProductData = {
  providerId: string;
  name: string;
  description: string;
  paidPrice: number;
  salePrice: number;
  qntd: number;
};

export type { IProductsProviderContextData };
