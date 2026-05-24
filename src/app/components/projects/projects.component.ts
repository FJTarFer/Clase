import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../models/portfolio.service';
import { Project } from '../../models/portfolio.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  template: `
    <section id="projectes" class="section">
      <h2 class="section-title">Projectes</h2>
      <div class="projects-grid">
        @for (project of projects; track project.title) {
          <div class="project-card">
            <span class="badge">{{ project.badge }}</span>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>
            <div class="tags">
              @for (tag of project.tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
            @if (project.github) {
              <a [href]="project.github" target="_blank" class="github-link">Ver en GitHub →</a>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .section { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; border-left: 4px solid #2563eb; padding-left: 0.75rem; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
    .project-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; transition: box-shadow 0.2s; display: flex; flex-direction: column; gap: 0.75rem; }
    .project-card:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.12); }
    .badge { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 20px; border: 1px solid #bfdbfe; }
    .project-title { font-size: 1rem; font-weight: 700; margin: 0; }
    .project-desc { font-size: 0.85rem; color: #64748b; line-height: 1.6; margin: 0; flex: 1; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .tag { background: #f1f5f9; color: #475569; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .github-link { font-size: 0.8rem; color: #2563eb; text-decoration: none; font-weight: 500; }
    .github-link:hover { text-decoration: underline; }
  `]
})
export class ProjectsComponent {
  private portfolioService = inject(PortfolioService);
  projects: Project[] = this.portfolioService.getProjects();
}
