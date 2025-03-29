import { Component } from '@angular/core';
import { environment } from '../environments/environment';

declare const process: {
  env: {
    API_URL: string;
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false
})
export class AppComponent {
  title = 'Camera';
}
