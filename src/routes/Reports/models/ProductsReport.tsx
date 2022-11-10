import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import { ReportProducts } from '../types';
import Chart from '../../../components/Chart';
import Table from '../../../components/Table';
import { cnpjMask } from '../../../utils/masks/cnpj';

const ProductsReport: React.FC<{ items: ReportProducts[] }> = ({ items }) => {
  const sortedProducts = useMemo(() => {
    return items?.sort((a, b) => (a.qntdSale > b.qntdSale ? -1 : 1));
  }, [items]);

  const options: Highcharts.Options = useMemo(() => {
    return {
      chart: {
        type: 'bar',
        backgroundColor: 'rgba(4, 5, 13, 0.8)',
        borderRadius: 4,
      },

      title: {
        text: 'Produtos mais vendidos',
        style: {
          color: 'white',
          fontSize: '24px',
        },
      },
      series: [
        {
          type: 'bar',
          data: sortedProducts?.map((prod) => prod.qntdSale).slice(0, 5),
          name: 'vendas',
          showInLegend: false,
          color: '#D9A53B',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
      ],
      xAxis: {
        categories: sortedProducts?.map((prod) => prod.name).slice(0, 5),
        title: {
          text: null,
        },
        labels: {
          style: {
            color: 'white',
            fontSize: '14px',
          },
        },
        lineColor: 'rgba(255, 255, 255, 0.3)',
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Vendas (unidades)',
          align: 'high',
          style: {
            color: 'white',
          },
        },
        gridLineColor: 'rgba(255, 255, 255, 0.3)',
        labels: {
          overflow: 'justify',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' unidades',
      },
    };
  }, [sortedProducts]);

  return (
    <div>
      <Chart chartOptions={options} />
      <br></br>
      {!!sortedProducts && (
        <Table
          items={sortedProducts.map((prod) => ({
            id: prod.productId,
            name: prod.name,
            qntdSale: prod.qntdSale,
            description: prod.description,
            providerName: prod.providerName,
            providerCnpj: cnpjMask(prod.providerCnpj),
          }))}
          headers={{
            id: 'id',
            name: 'Nome',
            qntdSale: 'Qtd',
            description: 'Descrição',
            providerName: 'Fornecedor',
            providerCnpj: 'CNPJ',
          }}
        />
      )}
    </div>
  );
};

export default ProductsReport;
