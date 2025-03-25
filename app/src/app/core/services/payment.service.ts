import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Payment from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  getPayments() {
    return new Observable
  }

  createPayment(payment: Partial<Payment>) {
    return new Observable
  }

  updatePayment(id: number, payment: Partial<Payment>) {
    return new Observable
  }

  deletePayment(id: number) {
    return new Observable
  }
}
