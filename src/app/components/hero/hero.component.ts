import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <div class="hero">
      <div class="avatar">FT</div>
      <h1>Francisco Tarriño Fernández</h1>
      <p>Desenvolupador d'Aplicacions Multiplataforma · DAM2</p>
      <div class="social-links">
        @for (link of socialLinks; track link.label) {
          <a [href]="link.url" target="_blank" rel="noopener">
            {{ link.label }}
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .hero { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 5rem 2rem; text-align: center; }
    .avatar { width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; margin: 0 auto 1.5rem; border: 3px solid rgba(255,255,255,0.4); }
    h1 { font-size: 2.2rem; font-weight: 700; margin: 0 0 0.5rem; }
    p { font-size: 1.1rem; opacity: 0.85; margin: 0 0 1.5rem; }
    .social-links { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .social-links a { background: rgba(255,255,255,0.15); color: white; text-decoration: none; padding: 0.5rem 1.2rem; border-radius: 8px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.25); transition: background 0.2s; }
    .social-links a:hover { background: rgba(255,255,255,0.25); }
  `]
})
export class HeroComponent {
  socialLinks = [
    { label: '🐙 GitHub', url: 'https://github.com/FJTarFer' },
    { label: '💼 LinkedIn', url: 'https://www.linkedin.com/in/francisco-tarriño-fernandez-018906399' },
  ];
}
