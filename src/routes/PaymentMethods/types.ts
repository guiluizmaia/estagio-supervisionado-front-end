interface IPaymentMethodsProviderContextData {
  paymentMethods: IPaymentMethod[];
  changePage: (page: number) => void;
  pages: number;
  editPaymentMethod: (paymentMethod: IPaymentMethod) => void;
  editPaymentMethodById: (paymentMethodId: string) => void;
  showForm: boolean;
  toggleShowForm: (open: boolean) => void;
  paymentMethodEditing: null | IPaymentMethod;
  createPaymentMethod: (
    paymentMethodInput: ICreatePaymentMethodData,
  ) => Promise<void>;
  confirmEditPaymentMethod: (
    paymentMethodInput: ICreatePaymentMethodData,
    id: string,
  ) => Promise<void>;
  deletePaymentMethod: (paymentMethodId: string) => void;
}

interface IPaymentMethod {
  id: string;
  formPayment: string;
  created_at: string;
  updated_at: string;
}
type ICreatePaymentMethodData = Pick<IPaymentMethod, 'formPayment'>;

export type {
  IPaymentMethodsProviderContextData,
  IPaymentMethod,
  ICreatePaymentMethodData,
};
