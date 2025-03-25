import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as DiscountActions from '../actions/discount.action';
import { DiscountService } from '../../services/discount.service';
import Discount from '../../models/discount.model';

@Injectable()
export class DiscountEffects {
  loadDiscounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscountActions.loadDiscounts),
      mergeMap(() =>
        this.discountService.getDiscounts().pipe(
          map((discounts: any) => DiscountActions.loadDiscountsSuccess({ discounts })),
          catchError((error) =>
            of(DiscountActions.loadDiscountsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addDiscount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscountActions.addDiscount),
      mergeMap(({ discount }) =>
        this.discountService.createDiscount(discount).pipe(
          map((newDiscount: any) => DiscountActions.addDiscountSuccess({ discount: newDiscount })),
          catchError((error) =>
            of(DiscountActions.addDiscountFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateDiscount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscountActions.updateDiscount),
      mergeMap(({ id, discount }) =>
        this.discountService.updateDiscount(id, discount).pipe(
          map((updatedDiscount: any) =>
            DiscountActions.updateDiscountSuccess({ discount: updatedDiscount })
          ),
          catchError((error) =>
            of(DiscountActions.updateDiscountFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteDiscount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscountActions.deleteDiscount),
      mergeMap(({ id }) =>
        this.discountService.deleteDiscount(id).pipe(
          map(() => DiscountActions.deleteDiscountSuccess({ id })),
          catchError((error) =>
            of(DiscountActions.deleteDiscountFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private discountService: DiscountService
  ) {}
}
