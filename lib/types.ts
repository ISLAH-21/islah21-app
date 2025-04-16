export interface Alumni {
  id: string
  name: string
  email: string
  position: string
  department: string
  graduationYear: string
  avatar: string
  portfolios: {
    url: string
    type: string
  }[]
  location: string
  company: string
  skills: string[]
  [key: string]: any
}
