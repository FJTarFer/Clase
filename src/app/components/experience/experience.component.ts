import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../models/portfolio.service';
import { Experience } from '../../models/portfolio.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  template: `
    <section id="experiencia" class="section">
      <h2 class="section-title">Experiència laboral / Pràctiques</h2>
      @for (exp of experiences; track exp.title) {
        <div class="exp-card">
          <div class="exp-header">
            <div class="exp-title">{{ exp.title }}</div>
            <span class="exp-date">{{ exp.date }}</span>
          </div>
          <p class="exp-desc">{{ exp.description }}</p>
        </div>
      }
    </section>
  `,
  styles: [`
    .section { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; border-left: 4px solid #2563eb; padding-left: 0.75rem; }
    .exp-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 1rem; }
    .exp-title { font-weight: 700; font-size: 1rem; }
    .exp-date { font-size: 0.8rem; color: #64748b; background: #f1f5f9; padding: 0.2rem 0.6rem; border-radius: 20px; white-space: nowrap; }
    .exp-desc { font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.7; }
  `]
})
export class ExperienceComponent {
  private portfolioService = inject(PortfolioService);
  experiences: Experience[] = this.portfolioService.getExperiences();
}
