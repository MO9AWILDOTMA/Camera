import { Component } from '@angular/core';

@Component({
  selector: 'app-client-Layout',
  standalone: false,
  templateUrl: './client-layout.component.html',
  styles: [`
    .client-dashboard {
      display: grid;
      grid-template-columns: 250px 1fr;
      min-height: 100vh;
    }
    .sidebar {
      padding: 1rem;
      background: #f5f5f5;
    }
  `]
})
export class ClientLayoutComponent {}
