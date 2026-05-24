export interface Skill {
  icon: string;
  name: string;
  level: string;
}

export interface Project {
  badge: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
}

export interface Video {
  title: string;
  description: string;
  youtubeId?: string;
}

export interface LearningSection {
  title: string;
  items: string[];
}

export interface Experience {
  title: string;
  date: string;
  description: string;
}
