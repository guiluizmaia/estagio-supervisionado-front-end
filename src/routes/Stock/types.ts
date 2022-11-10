import { Product } from '../Products/types';

interface IStockProviderContextData {
  products: Product[];
  showInputForm: boolean;
  onToggleShowInputForm: (open: boolean) => void;
  addProductInput: (data: StockInputData) => Promise<void>;
  changePage: (page: number) => void;
  pages: number;
  history: StockHistory[];
  onChangeDate: (date: string, type: 'start' | 'end') => void;
}

interface StockInputData {
  date: Date;
  products: StockProduct[];
}

export type StockOperationType = 'ADD' | 'SUB';
interface StockProduct {
  productId: string;
  type: StockOperationType;
  price?: string;
  qntd: number;
}

interface StockHistory {
  id: string;
  date: Date;
  products: StockProductHistory[];
}

interface StockProductHistory extends StockProduct {
  id: string;
  name: string;
}

export type {
  IStockProviderContextData,
  StockInputData,
  StockProduct,
  StockHistory,
};
