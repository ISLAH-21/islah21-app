export interface SocialMedia {
  x?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  behance?: string;
}

export interface AlumniProps {
  id: number;
  name: string;
  job: string;
  residence: string;
  email: string;
  phone: string;
  avatar: string;
  socialMedia?: SocialMedia;
  personalSite?: string;
}
