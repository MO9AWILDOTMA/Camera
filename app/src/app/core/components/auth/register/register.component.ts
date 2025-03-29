import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.action';
import { AppState } from '../../../store/reducers/app.reducer';
import { AuthState } from '../../../store/states/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;;
  authState$: Observable<AuthState>;
  @Output() switchPage = new EventEmitter<void>();

  handleClick() {
    this.switchPage.emit();
  }
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.authState$ = this.store.select(state => state.auth);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.store.dispatch(AuthActions.register({
        user: this.registerForm.value
      }));
    }
  }
}
