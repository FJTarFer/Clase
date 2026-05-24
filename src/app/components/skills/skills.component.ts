import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../models/portfolio.service';
import { Skill } from '../../models/portfolio.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  template: `
    <section id="skills" class="section">
      <h2 class="section-title">Llenguatges i Frameworks</h2>
      <div class="skills-grid">
        @for (skill of skills; track skill.name) {
          <div class="skill-card">
            <div class="skill-icon">{{ skill.icon }}</div>
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-level">{{ skill.level }}</div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .section { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; border-left: 4px solid #2563eb; padding-left: 0.75rem; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; }
    .skill-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; text-align: center; transition: box-shadow 0.2s, border-color 0.2s; }
    .skill-card:hover { box-shadow: 0 4px 12px rgba(37,99,235,0.1); border-color: #2563eb; }
    .skill-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .skill-name { font-size: 0.85rem; font-weight: 600; }
    .skill-level { font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; }
  `]
})
export class SkillsComponent {
  private portfolioService = inject(PortfolioService);
  skills: Skill[] = this.portfolioService.getSkills();
}
