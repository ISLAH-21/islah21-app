export interface SocialMedia {
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface AlumniProps {
  id: number;
  name: string;
  job: string;
  email: string;
  phone: string;
  avatar: string;
  socialMedia?: SocialMedia;
  personalSite?: string;
}
