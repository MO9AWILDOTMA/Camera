import { createSelector } from '@ngrx/store';
import { DiscountState } from '../states/discount.state';
import Discount from '../../models/discount.model';

export const selectDiscountState = (state: { discount: DiscountState }) => state.discount;

export const selectDiscounts = createSelector(
  selectDiscountState,
  (state: DiscountState) => state.discounts
);

export const selectDiscountLoading = createSelector(
  selectDiscountState,
  (state: DiscountState) => state.loading
);

export const selectDiscountError = createSelector(
  selectDiscountState,
  (state: DiscountState) => state.error
);

export const selectDiscountById = (id: number) =>
  createSelector(selectDiscounts, (discounts: Discount[]) =>
    discounts.find((discount) => discount.id === id)
  );

export const selectActiveDiscounts = createSelector(
  selectDiscounts,
  (discounts: Discount[]) =>
    discounts.filter((discount) => discount.isActive)
);
