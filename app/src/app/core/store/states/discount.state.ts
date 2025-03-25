import Discount from "../../models/discount.model";

export interface DiscountState {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
}

export const initialDiscountState: DiscountState = {
  discounts: [],
  loading: false,
  error: null,
};
