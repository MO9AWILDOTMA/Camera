import { createReducer, on } from '@ngrx/store';
import { DiscountState, initialDiscountState } from '../states/discount.state';
import * as DiscountActions from '../actions/discount.action';

export const discountReducer = createReducer(
  initialDiscountState,
  // Load Discounts
  on(DiscountActions.loadDiscounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DiscountActions.loadDiscountsSuccess, (state, { discounts }) => ({
    ...state,
    discounts,
    loading: false,
    error: null,
  })),
  on(DiscountActions.loadDiscountsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Discount
  on(DiscountActions.addDiscount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DiscountActions.addDiscountSuccess, (state, { discount }) => ({
    ...state,
    discounts: [...state.discounts, discount],
    loading: false,
    error: null,
  })),
  on(DiscountActions.addDiscountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Discount
  on(DiscountActions.updateDiscount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DiscountActions.updateDiscountSuccess, (state, { discount }) => ({
    ...state,
    discounts: state.discounts.map((d) => (d.id === discount.id ? discount : d)),
    loading: false,
    error: null,
  })),
  on(DiscountActions.updateDiscountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Discount
  on(DiscountActions.deleteDiscount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DiscountActions.deleteDiscountSuccess, (state, { id }) => ({
    ...state,
    discounts: state.discounts.filter((discount) => discount.id !== id),
    loading: false,
    error: null,
  })),
  on(DiscountActions.deleteDiscountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
