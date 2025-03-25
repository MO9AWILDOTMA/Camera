import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Discount from '../models/discount.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor() { }

  getDiscounts() {
    return new Observable
  }

  createDiscount(discount: Partial<Discount>) {
    return new Observable
  }
  updateDiscount(id: number, discount: Partial<Discount>) {
    return new Observable
  }

  deleteDiscount(id: number) {
    return new Observable
  }
}
