import React, { useMemo } from 'react';
import Table from '../../../components/Table';
import { currency } from '../../../utils/masks/currency';
import { useSaleDetails } from '../context';

const ProductsList: React.FC = () => {
  const { details } = useSaleDetails();

  const parsedProducts = useMemo(() => {
    if (!details?.products) return [];
    console.log(details?.products);
    const products = details?.products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        qntd: product.qntd,
        salePrice: currency(Number(product.price)),
        total: currency(Number(product.price) * product.qntd),
      };
    });

    const totalLine = {
      id: '',
      name: '',
      qntd: '',
      salePrice: 'TOTAL:',
      total: currency(Number(details.amount)),
    };

    return [...products, totalLine];
  }, [details?.amount, details?.products]);

  return (
    <Table
      highlightLastRow
      headers={{
        id: 'id',
        name: 'Nome',
        qntd: 'Qtd.',
        salePrice: 'Valor Venda',
        total: 'Total',
      }}
      items={parsedProducts}
    />
  );
};

export default ProductsList;
