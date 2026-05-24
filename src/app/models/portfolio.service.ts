import { Injectable } from '@angular/core';
import { Skill, Project, Video, LearningSection, Experience } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  getSkills(): Skill[] {
    return [
      { icon: '☕', name: 'Java', level: 'Spring Boot · REST APIs' },
      { icon: '🌐', name: 'HTML / CSS', level: 'Responsive · Flexbox' },
      { icon: '⚡', name: 'JavaScript', level: 'Fetch API · DOM' },
      { icon: '🔺', name: 'Angular', level: 'Components · Services' },
      { icon: '🐋', name: 'Docker', level: 'Containers · Compose' },
      { icon: '🗄️', name: 'MariaDB', level: 'JPA · SQL Relacional' },
      { icon: '🔒', name: 'Spring Security', level: 'JWT · BCrypt' },
      { icon: '📱', name: 'Android', level: 'Java · Retrofit' },
    ];
  }

  getProjects(): Project[] {
    return [
      {
        badge: 'Projecte Final DAM',
        title: 'ImperiumFitness',
        description: 'Aplicació multiplataforma per a la gestió d\'un gimnàs. Inclou control d\'estoc, gestió de reserves de classes, botiga online i panell d\'estadístiques per a administradors. Desplegat amb Docker Compose.',
        tags: ['Spring Boot', 'MariaDB', 'JWT', 'Android', 'Docker', 'HTML/CSS/JS'],
        github: 'https://github.com/FJTarFer'
      },
      {
        badge: 'Pràctica Docker',
        title: 'Spring Boot Hello API',
        description: 'API REST mínima amb Spring Boot dockeritzada i desplegada en un servidor remot. Demostra el cicle complet: compilació, creació d\'imatge Docker i desplegament en producció.',
        tags: ['Spring Boot', 'Docker', 'eclipse-temurin:21', 'REST API'],
        github: 'https://github.com/FJTarFer'
      },
      {
        badge: 'Pràctica Angular',
        title: 'Angular Homes',
        description: 'Aplicació Angular per llistar i filtrar habitatges. Dockeritzada amb Nginx Alpine. Demostra components, serveis injectats, iteració amb @for i desplegament en contenidor.',
        tags: ['Angular', 'TypeScript', 'Nginx', 'Docker', 'json-server'],
        github: 'https://github.com/FJTarFer'
      },
    ];
  }

  getVideos(): Video[] {
    return [
      {
        title: 'Spring Boot + Docker en producció',
        description: 'Com crear una API REST amb Spring Boot i dockeritzar-la per desplegar-la en un servidor remot.',
        youtubeId: ''
      },
      {
        title: 'Angular Homes – Estructura i desplegament',
        description: 'Explicació de l\'estructura d\'una aplicació Angular: components, serveis, plantilles i dockerització amb Nginx.',
        youtubeId: ''
      },
    ];
  }

  getLearningSections(): LearningSection[] {
    return [
      {
        title: 'Altres Assignatures',
        items: ['Programació en Java', 'Bases de dades relacionals', 'Sistemes informàtics', 'Entorns de desenvolupament', 'Accés a dades', 'Programació de serveis']
      },
      {
        title: 'Desenvolupament Web',
        items: ['APIs REST amb Spring Boot', 'Autenticació JWT + BCrypt', 'Arquitectura de 3 capes', 'Contenidors Docker', 'Angular i components', 'Desplegament en producció']
      },
      {
        title: 'Eines i metodologies',
        items: ['Git i GitHub', 'Docker Compose', 'Android Studio', 'Postman / API testing', 'Metodologies àgils', 'Tests unitaris JUnit']
      }
    ];
  }

  getExperiences(): Experience[] {
    return [
      {
        title: 'Estudiant DAM2 – Projecte final en equip',
        date: '2025 – 2026',
        description: 'Desenvolupament del projecte final del cicle formatiu en equip, simulant un entorn professional real. Responsable del backend: API REST amb Spring Boot, seguretat JWT, base de dades MariaDB i desplegament amb Docker.'
      }
    ];
  }
}
