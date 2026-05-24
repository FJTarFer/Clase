import { Component } from '@angular/core';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { VideosComponent } from './components/videos/videos.component';
import { LearningComponent } from './components/learning/learning.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { FutureComponent } from './components/future/future.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    HeroComponent,
    SkillsComponent,
    ProjectsComponent,
    VideosComponent,
    LearningComponent,
    ExperienceComponent,
    FutureComponent,
  ],
  template: `
    <app-nav />
    <app-hero />
    <main>
      <section id="sobre-mi" class="section">
        <h2 class="section-title">Qui soc?</h2>
        <div class="about-text">
          Soc Francisco Tarriño Fernández, estudiant de segon curs del CFGS de Desenvolupament d'Aplicacions Multiplataforma (DAM2).
          M'apassiona el desenvolupament de software, especialment el backend i les aplicacions web.
          Durant aquest curs he treballat amb tecnologies com Spring Boot, Angular, Docker i bases de dades relacionals,
          i he après a construir sistemes complets des del disseny fins al desplegament en producció.
        </div>
      </section>
      <hr class="divider" />
      <app-skills />
      <hr class="divider" />
      <app-projects />
      <hr class="divider" />
      <app-videos />
      <hr class="divider" />
      <app-learning />
      <hr class="divider" />
      <app-experience />
      <hr class="divider" />
      <app-future />
    </main>
    <footer class="footer">
      <p>Francisco Tarriño Fernández · DAM2 · 2026</p>
      <p>
        <a href="https://github.com/FJTarFer" target="_blank">GitHub</a> ·
        <a href="https://www.linkedin.com/in/francisco-tarriño-fernandez-018906399" target="_blank">LinkedIn</a>
      </p>
    </footer>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { font-family: 'Segoe UI', system-ui, sans-serif; color: #0f172a; background: #f8fafc; display: block; }
    .section { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; border-left: 4px solid #2563eb; padding-left: 0.75rem; }
    .about-text { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; color: #64748b; line-height: 1.8; }
    .divider { border: none; border-top: 1px solid #e2e8f0; max-width: 900px; margin: 0 auto; }
    .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 2rem; font-size: 0.85rem; margin-top: 2rem; }
    .footer a { color: #60a5fa; text-decoration: none; }
    .footer p + p { margin-top: 0.5rem; }
    html { scroll-behavior: smooth; }
  `]
})
export class AppComponent {}
