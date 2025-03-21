import Discount from "../../models/discount.model";

export interface DiscountsState {
  Discounts: Discount[];
  loading: boolean;
  error: string | null;
}

export const initialDiscountsState: DiscountsState = {
  Discounts: [],
  loading: false,
  error: null,
};
