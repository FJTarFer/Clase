import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../models/portfolio.service';
import { Video } from '../../models/portfolio.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  standalone: true,
  template: `
    <section id="videos" class="section">
      <h2 class="section-title">Vídeos</h2>
      <div class="videos-grid">
        @for (video of videos; track video.title) {
          <div class="video-card">
            @if (video.youtubeId) {
              <iframe
                [src]="getSafeUrl(video.youtubeId)"
                width="100%"
                height="200"
                frameborder="0"
                allowfullscreen
                title="{{ video.title }}">
              </iframe>
            } @else {
              <div class="placeholder">
                <span>▶</span>
                <p>Vídeo pendent de pujar</p>
              </div>
            }
            <div class="video-info">
              <div class="video-title">{{ video.title }}</div>
              <div class="video-desc">{{ video.description }}</div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .section { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; border-left: 4px solid #2563eb; padding-left: 0.75rem; }
    .videos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .video-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .placeholder { background: linear-gradient(135deg, #1e3a5f, #2563eb); height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; gap: 0.5rem; }
    .placeholder span { font-size: 3rem; }
    .placeholder p { font-size: 0.85rem; opacity: 0.85; }
    .video-info { padding: 1rem; }
    .video-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.35rem; }
    .video-desc { font-size: 0.8rem; color: #64748b; }
  `]
})
export class VideosComponent {
  private portfolioService = inject(PortfolioService);
  private sanitizer = inject(DomSanitizer);
  videos: Video[] = this.portfolioService.getVideos();

  getSafeUrl(youtubeId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${youtubeId}`
    );
  }
}
