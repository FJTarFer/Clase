import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../models/portfolio.service';
import { LearningSection } from '../../models/portfolio.model';

@Component({
  selector: 'app-learning',
  standalone: true,
  template: `
    <section id="aprenentatges" class="section">
      <h2 class="section-title">Aprenentatges</h2>
      <div class="learning-grid">
        @for (section of sections; track section.title) {
          <div class="learning-card">
            <h3>{{ section.title }}</h3>
            <ul>
              @for (item of section.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .section { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; border-left: 4px solid #2563eb; padding-left: 0.75rem; }
    .learning-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .learning-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; }
    .learning-card h3 { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.75rem; color: #2563eb; }
    .learning-card ul { list-style: none; padding: 0; margin: 0; }
    .learning-card ul li { font-size: 0.82rem; color: #64748b; padding: 0.2rem 0; display: flex; align-items: center; gap: 0.4rem; }
    .learning-card ul li::before { content: "→"; color: #2563eb; font-size: 0.75rem; flex-shrink: 0; }
  `]
})
export class LearningComponent {
  private portfolioService = inject(PortfolioService);
  sections: LearningSection[] = this.portfolioService.getLearningSections();
}
