import { useMemo } from 'react';
import ProductForm from '../../components/Forms/ProductForm';
import Pagination from '../../components/Pagination';
import Table from '../../components/Table';
import { currency } from '../../utils/masks/currency';
import '../style.css';
import { ProductsProvider, useProducts } from './context';

const ProductsScreen = () => {
  const {
    products,
    toggleShowForm,
    productEditing,
    showForm,
    pages,
    editProductById,
    changePage,
    incativateProduct,
    search,
    onSearch,
    readOnlyForm,
  } = useProducts();

  const parsedProducts = useMemo(() => {
    if (!products) return [];
    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        qntd: product.qntd,
        salePrice: currency(product.salePrice),
        actions: '',
      };
    });
  }, [products]);

  return (
    <div className='content-simple'>
      <h1 className='content-title'>Produtos</h1>
      <div className='button-add-new-row'>
        <button className='button-add-new' onClick={() => toggleShowForm(true)}>
          <i className='bi bi-person-plus'></i>
          <span>Novo</span>
        </button>
      </div>
      <div>
        <div className='form-row' style={{ marginBottom: '1rem' }}>
          <input
            className='form-input'
            style={{ borderBottom: '2px solid #04050D' }}
            placeholder='Buscar por nome'
            onChange={(e) => onSearch(e.target.value)}
            value={search}
          ></input>
        </div>
      </div>
      <Table
        headers={{
          id: 'id',
          name: 'Nome',
          qntd: 'Quantidade',
          salePrice: 'Preço',
          actions: 'Ações',
        }}
        items={parsedProducts}
        customRenderers={{
          actions: (product) => (
            <>
              <button
                className='button button__edit'
                onClick={() => editProductById(product.id)}
              >
                <i className='bi bi-pencil-square'></i>
              </button>{' '}
              <button
                className='button button__edit'
                onClick={() => editProductById(product.id, true)}
              >
                <i className='bi bi-eye'></i>
              </button>{' '}
              <button
                className='button button__delete'
                onClick={(e) => {
                  e.preventDefault();
                  incativateProduct(product.id);
                }}
              >
                <i className='bi bi-trash3'></i>
              </button>
            </>
          ),
        }}
      />

      <Pagination pages={pages} onChange={(page: number) => changePage(page)} />

      {showForm && (
        <ProductForm
          product={productEditing ?? undefined}
          readOnly={readOnlyForm}
        />
      )}
    </div>
  );
};

const Products = () => {
  return (
    <ProductsProvider>
      <ProductsScreen />
    </ProductsProvider>
  );
};

export default Products;
