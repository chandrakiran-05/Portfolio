export interface CVInfo {
  name: string;
  title: string;
  tagline: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedinUrl: string;
}

export interface Job {
  role: string;
  org: string;
  period: string;
  desc: string;
  link?: string;
  linkLabel?: string;
}

export interface Education {
  school: string;
  detail: string;
  period: string;
}

export interface Project {
  title: string;
  tagline: string;
  desc: string;
  link?: string;
  image?: string;
}

export interface SocialLinks {
  github?: string;
  instagram?: string;
  dribbble?: string;
  other?: string;
}

export interface CVData {
  cv: CVInfo;
  jobs: Job[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: string[];
  projects: Project[];
  interests?: string[];
  social: SocialLinks;
}
