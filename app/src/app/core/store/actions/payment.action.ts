import { createAction, props } from '@ngrx/store';
import Payment from '../../models/payment.model';

// Load Payments
export const loadPayments = createAction('[Payment] Load Payments');
export const loadPaymentsSuccess = createAction(
  '[Payment] Load Payments Success',
  props<{ payments: Payment[] }>()
);
export const loadPaymentsFailure = createAction(
  '[Payment] Load Payments Failure',
  props<{ error: string }>()
);

// Add Payment
export const addPayment = createAction(
  '[Payment] Add Payment',
  props<{ payment: Partial<Payment> }>()
);
export const addPaymentSuccess = createAction(
  '[Payment] Add Payment Success',
  props<{ payment: Payment }>()
);
export const addPaymentFailure = createAction(
  '[Payment] Add Payment Failure',
  props<{ error: string }>()
);

// Update Payment
export const updatePayment = createAction(
  '[Payment] Update Payment',
  props<{ id: number; payment: Partial<Payment> }>()
);
export const updatePaymentSuccess = createAction(
  '[Payment] Update Payment Success',
  props<{ payment: Payment }>()
);
export const updatePaymentFailure = createAction(
  '[Payment] Update Payment Failure',
  props<{ error: string }>()
);

// Delete Payment
export const deletePayment = createAction(
  '[Payment] Delete Payment',
  props<{ id: number }>()
);
export const deletePaymentSuccess = createAction(
  '[Payment] Delete Payment Success',
  props<{ id: number }>()
);
export const deletePaymentFailure = createAction(
  '[Payment] Delete Payment Failure',
  props<{ error: string }>()
);
