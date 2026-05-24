import { Component } from '@angular/core';
import { Home } from './home/home';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [Home, RouterLink, RouterOutlet],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
        </header>
      </a>
      <section class="content">
        <router-outlet />
      </section>
      <footer>
        <h1>Made by {{title}} </h1>
      </footer>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'FRANCISCO TARRIÑO FERNÁNDEZ';
}