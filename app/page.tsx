import { AlumniDirectory } from "@/components/alumni-directory"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-2 font-bold text-3xl">Alumni Directory</h1>
      <p className="mb-8 text-muted-foreground">Search and filter our school alumni network</p>
      <AlumniDirectory />
    </main>
  )
}
