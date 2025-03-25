import Payment from "../../models/payment.model";

export interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

export const initialPaymentState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
};
