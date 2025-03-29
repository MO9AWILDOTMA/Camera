import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as PaymentActions from '../actions/payment.action';
import { PaymentService } from '../../services/payment.service';

@Injectable()
export class PaymentEffects {
  loadPayments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentActions.loadPayments),
      mergeMap(() =>
        this.paymentService.getPayments().pipe(
          map((payments: any) => PaymentActions.loadPaymentsSuccess({ payments })),
          catchError((error) =>
            of(PaymentActions.loadPaymentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentActions.addPayment),
      mergeMap(({ payment }) =>
        this.paymentService.createPayment(payment).pipe(
          map((newPayment: any) => PaymentActions.addPaymentSuccess({ payment: newPayment })),
          catchError((error) =>
            of(PaymentActions.addPaymentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updatePayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentActions.updatePayment),
      mergeMap(({ id, payment }) =>
        this.paymentService.updatePayment(id, payment).pipe(
          map((updatedPayment: any) =>
            PaymentActions.updatePaymentSuccess({ payment: updatedPayment })
          ),
          catchError((error) =>
            of(PaymentActions.updatePaymentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deletePayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentActions.deletePayment),
      mergeMap(({ id }) =>
        this.paymentService.deletePayment(id).pipe(
          map(() => PaymentActions.deletePaymentSuccess({ id })),
          catchError((error) =>
            of(PaymentActions.deletePaymentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private paymentService: PaymentService
  ) {}
}
