import { AlumniDirectory } from "@/components/alumni-directory"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Alumni Directory</h1>
      <p className="text-muted-foreground mb-8">Search and filter our school alumni network</p>
      <AlumniDirectory />
    </main>
  )
}
