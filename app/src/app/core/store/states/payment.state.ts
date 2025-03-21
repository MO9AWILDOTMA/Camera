import Payment from "../../models/payment.model";

export interface PaymentsState {
  Payments: Payment[];
  loading: boolean;
  error: string | null;
}

export const initialPaymentsState: PaymentsState = {
  Payments: [],
  loading: false,
  error: null,
};
