import { createReducer, on } from '@ngrx/store';
import { PaymentState, initialPaymentState } from '../states/payment.state';
import * as PaymentActions from '../actions/payment.action';

export const paymentReducer = createReducer(
  initialPaymentState,
  // Load Payments
  on(PaymentActions.loadPayments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PaymentActions.loadPaymentsSuccess, (state, { payments }) => ({
    ...state,
    payments,
    loading: false,
    error: null,
  })),
  on(PaymentActions.loadPaymentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Payment
  on(PaymentActions.addPayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PaymentActions.addPaymentSuccess, (state, { payment }) => ({
    ...state,
    payments: [...state.payments, payment],
    loading: false,
    error: null,
  })),
  on(PaymentActions.addPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Payment
  on(PaymentActions.updatePayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PaymentActions.updatePaymentSuccess, (state, { payment }) => ({
    ...state,
    payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
    loading: false,
    error: null,
  })),
  on(PaymentActions.updatePaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Payment
  on(PaymentActions.deletePayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PaymentActions.deletePaymentSuccess, (state, { id }) => ({
    ...state,
    payments: state.payments.filter((payment) => payment.id !== id),
    loading: false,
    error: null,
  })),
  on(PaymentActions.deletePaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
