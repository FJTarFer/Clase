import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <span class="nav-logo">FTF</span>
      <button class="burger" (click)="toggleMenu()" aria-label="Menú">
        {{ menuObert() ? '✕' : '☰' }}
      </button>
      <ul class="nav-links" [class.open]="menuObert()">
        @for (link of links; track link.href) {
          <li><a [href]="link.href" (click)="tancarMenu()">{{ link.label }}</a></li>
        }
      </ul>
    </nav>
  `,
  styles: [`
    .navbar { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
    .nav-logo { font-weight: 700; font-size: 1.1rem; color: #2563eb; }
    .nav-links { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
    .nav-links a { text-decoration: none; color: #64748b; font-size: 0.9rem; transition: color 0.2s; }
    .nav-links a:hover { color: #2563eb; }
    .burger { display: none; background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #0f172a; }
    @media (max-width: 640px) {
      .burger { display: block; }
      .nav-links { display: none; flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: #fff; border-bottom: 1px solid #e2e8f0; padding: 1rem 2rem; gap: 1rem; }
      .nav-links.open { display: flex; }
    }
  `]
})
export class NavComponent {
  menuObert = signal(false);

  links = [
    { href: '#sobre-mi', label: 'Sobre mi' },
    { href: '#skills', label: 'Skills' },
    { href: '#projectes', label: 'Projectes' },
    { href: '#videos', label: 'Vídeos' },
    { href: '#aprenentatges', label: 'Aprenentatges' },
    { href: '#futur', label: 'Futur' },
  ];

  toggleMenu(): void {
    this.menuObert.update(v => !v);
  }

  tancarMenu(): void {
    this.menuObert.set(false);
  }
}
