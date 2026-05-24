import { Component } from '@angular/core';

@Component({
  selector: 'app-future',
  standalone: true,
  template: `
    <section id="futur" class="section">
      <h2 class="section-title">Expectatives de futur</h2>
      <div class="future-card">
        <h3>En què m'agradaria treballar</h3>
        <p>{{ descripcio }}</p>
        <div class="future-tags">
          @for (tag of tags; track tag) {
            <span class="future-tag">{{ tag }}</span>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; border-left: 4px solid #2563eb; padding-left: 0.75rem; }
    .future-card { background: linear-gradient(135deg, #eff6ff, #f0f9ff); border: 1px solid #bfdbfe; border-radius: 12px; padding: 2rem; text-align: center; }
    .future-card h3 { font-size: 1.1rem; font-weight: 700; color: #1e40af; margin-bottom: 0.75rem; }
    .future-card p { color: #475569; font-size: 0.9rem; max-width: 600px; margin: 0 auto; line-height: 1.7; }
    .future-tags { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem; }
    .future-tag { background: white; border: 1px solid #bfdbfe; color: #2563eb; font-size: 0.8rem; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 500; }
  `]
})
export class FutureComponent {
  descripcio = 'M\'agradaria treballar com a desenvolupador backend o fullstack en una empresa tecnològica on pugui continuar aprenent. Estic especialment interessat en el desenvolupament d\'APIs, arquitectures de microserveis i desplegament al núvol. A llarg termini m\'agradaria especialitzar-me en DevOps o arquitectura de sistemes.';

  tags = ['Backend Developer', 'Fullstack', 'DevOps', 'Cloud', 'Microserveis'];
}
