import { createSelector } from '@ngrx/store';
import { PaymentState } from '../states/payment.state';
import Payment from '../../models/payment.model';

export const selectPaymentState = (state: { payment: PaymentState }) => state.payment;

export const selectPayments = createSelector(
  selectPaymentState,
  (state: PaymentState) => state.payments
);

export const selectPaymentLoading = createSelector(
  selectPaymentState,
  (state: PaymentState) => state.loading
);

export const selectPaymentError = createSelector(
  selectPaymentState,
  (state: PaymentState) => state.error
);

export const selectPaymentById = (id: number) =>
  createSelector(selectPayments, (payments: Payment[]) =>
    payments.find((payment) => payment.id === id)
  );

export const selectPaymentsByUser = (userId: number) =>
  createSelector(selectPayments, (payments: Payment[]) =>
    payments.filter((payment) => payment.userId === userId)
  );

export const selectPaymentsByStatus = (status: string) =>
  createSelector(selectPayments, (payments: Payment[]) =>
    payments.filter((payment) => payment.status === status)
  );
