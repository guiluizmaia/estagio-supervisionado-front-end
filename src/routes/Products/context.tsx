/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from 'axios';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { IPaginatedResponse } from '../../types/global';
import { Provider } from '../Providers/types';
import {
  Product,
  CreateProductData,
  IProductsProviderContextData,
} from './types';

const ProductsContext = createContext({} as IProductsProviderContextData);

export const ProductsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [productEditing, setProductEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [readOnlyForm, setReadOnlyForm] = useState(false);

  const handleEditProduct = (product: Product) => {
    setProductEditing(product);
    setShowForm(true);
  };

  const handleEditProductById = (productId: string, readOnly?: boolean) => {
    setReadOnlyForm(readOnly ?? false);
    const product = products.find((_product) => _product.id === productId);
    setProductEditing(product ?? null);
    setShowForm(true);
  };

  const handleToggleShowForm = (open: boolean, readOnly?: boolean) => {
    setReadOnlyForm(readOnly ?? false);
    setShowForm(open);
    !open && setProductEditing(null);
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchProducts = async () => {
    try {
      const response = await api.get<IPaginatedResponse<Product>>(
        `/products?page=${page}${!search ? '' : `&search=${search}`}`,
      );
      setProducts(response.data.result);
      setPages(response.data.lastPage);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await api.get<Provider[]>(`/providers?all=true`);
      console.log(response.data)
      setProviders(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createProduct = async (data: CreateProductData) => {
    try {
      const response = await api.post<Product>('/products', data);
      setProducts([response.data, ...products]);
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };

  const confirmEditProduct = async (data: CreateProductData, id: string) => {
    try {
      const response = await api.patch<Product>('/products', {
        ...data,
        id,
      });
      console.log(response.data);
      setProducts(
        products.map((product) =>
          product.id !== response.data.id ? product : response.data,
        ),
      );
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data.message : err;
      throw new Error(message);
    }
  };
  const handleIncativateProduct = async (productId: string) => {
    toast.promise(
      async () => {
        const response = await api.patch<Product>('/products', {
          id: productId,
          exclude: true,
        });

        setProducts(
          products.filter((product) => product.id !== response.data.id),
        );
      },
      {
        pending: 'Excluindo Produto...',
        success: {
          render: () => {
            return 'Produto excluido!';
          },
        },
        error: {
          render: () => {
            return 'Erro ao excluir Produto :/';
          },
        },
      }
    )
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        changePage: (page: number) => setPage(page),
        onSearch: (search: string) => setSearch(search),
        pages,
        showForm,
        editProduct: handleEditProduct,
        editProductById: handleEditProductById,
        toggleShowForm: handleToggleShowForm,
        productEditing,
        createProduct,
        confirmEditProduct,
        incativateProduct: handleIncativateProduct,
        providers,
        search,
        readOnlyForm,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductsContext);
};
