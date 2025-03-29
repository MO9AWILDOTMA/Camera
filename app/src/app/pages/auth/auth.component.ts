import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: false
})
export class AuthComponent {
  login: boolean = true;


  handleWhichPage() {
    this.login = !this.login;
  }
}
