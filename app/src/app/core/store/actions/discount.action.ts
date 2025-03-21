import { createAction, props } from '@ngrx/store';
import Discount from '../../models/discount.model';

// Load Discounts
export const loadDiscounts = createAction('[Discount] Load Discounts');
export const loadDiscountsSuccess = createAction(
  '[Discount] Load Discounts Success',
  props<{ discounts: Discount[] }>()
);
export const loadDiscountsFailure = createAction(
  '[Discount] Load Discounts Failure',
  props<{ error: string }>()
);

// Add Discount
export const addDiscount = createAction(
  '[Discount] Add Discount',
  props<{ discount: Partial<Discount> }>()
);
export const addDiscountSuccess = createAction(
  '[Discount] Add Discount Success',
  props<{ discount: Discount }>()
);
export const addDiscountFailure = createAction(
  '[Discount] Add Discount Failure',
  props<{ error: string }>()
);

// Update Discount
export const updateDiscount = createAction(
  '[Discount] Update Discount',
  props<{ id: number; discount: Partial<Discount> }>()
);
export const updateDiscountSuccess = createAction(
  '[Discount] Update Discount Success',
  props<{ discount: Discount }>()
);
export const updateDiscountFailure = createAction(
  '[Discount] Update Discount Failure',
  props<{ error: string }>()
);

// Delete Discount
export const deleteDiscount = createAction(
  '[Discount] Delete Discount',
  props<{ id: number }>()
);
export const deleteDiscountSuccess = createAction(
  '[Discount] Delete Discount Success',
  props<{ id: number }>()
);
export const deleteDiscountFailure = createAction(
  '[Discount] Delete Discount Failure',
  props<{ error: string }>()
);
