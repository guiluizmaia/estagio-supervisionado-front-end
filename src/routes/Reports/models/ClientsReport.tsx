import React, { useMemo } from 'react';
import Chart from '../../../components/Chart';
import Highcharts from 'highcharts';
import Table from '../../../components/Table';
import { ReportClients } from '../types';
import { currency } from '../../../utils/masks/currency';

const ClientsReport: React.FC<{ items: ReportClients[] }> = ({ items }) => {
  const sortedClients = useMemo(() => {
    return items?.sort((a, b) =>
      a.valuePayInPeriod > b.valuePayInPeriod ? -1 : 1,
    );
  }, [items]);

  const options: Highcharts.Options = useMemo(() => {
    return {
      chart: {
        type: 'bar',
        backgroundColor: 'rgba(4, 5, 13, 0.8)',
        borderRadius: 4,
      },

      title: {
        text: 'Clientes que mais compraram',
        style: {
          color: 'white',
          fontSize: '24px',
        },
      },
      series: [
        {
          type: 'bar',
          data: sortedClients
            ?.map((client) => client.valuePayInPeriod)
            .slice(0, 10),
          name: 'vendas',
          showInLegend: false,
          color: '#D9A53B',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
      ],
      xAxis: {
        categories: sortedClients?.map((client) => client.name).slice(0, 10),
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
          text: 'Vendas',
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
        valuePrefix: 'R$ ',
      },
    };
  }, [sortedClients]);

  return (
    <div>
      <Chart chartOptions={options} />
      <br></br>
      {!!sortedClients && (
        <Table
          items={sortedClients.map((client) => 
            {
              let lastSale = '-'
              if(client.lastSaleDateInPeriod){
                lastSale = new Date(client.lastSaleDateInPeriod).toLocaleDateString(
                  'pt-BR',
                )
              }
              return {
                id: client.clientId,
                name: client.name,
                qntdSale: client.salesQuantInPeriod,
                total: currency(client.valuePayInPeriod),
                lastSale: lastSale,
                timeRegistered: new Date(client.initDate).toLocaleDateString(
                  'pt-BR',
                ),
                status: !client.exclude
                  ? 'ATIVO'
                  : `EXLUÍDO EM ${new Date(
                      client.excludeDate ?? '',
                    ).toLocaleDateString('pt-BR')}`,
              }
            }
            )
          }
          headers={{
            id: 'id',
            name: 'Nome',
            qntdSale: 'Compras',
            total: 'Total',
            lastSale: 'Última compra',
            timeRegistered: 'Data cadastro',
            status: 'Situacão',
          }}
        />
      )}
    </div>
  );
};

export default ClientsReport;
