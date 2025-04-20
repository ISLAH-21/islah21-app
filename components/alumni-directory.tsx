"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlumniTable } from "@/components/alumni-table"
import { alumniData } from "@/lib/data"

export function AlumniDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  const [graduationYearFilter, setGraduationYearFilter] = useState("")

  // Get unique values for filters
  const allSkills = alumniData.flatMap((alumni) => alumni.skills)
  const uniqueSkills = [...new Set(allSkills)].sort()

  const locations = [...new Set(alumniData.map((alumni) => alumni.location))]
  const companies = [...new Set(alumniData.map((alumni) => alumni.company))]
  const graduationYears = [...new Set(alumniData.map((alumni) => alumni.graduationYear))]

  // Filter alumni data based on search and filters
  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      searchQuery === "" ||
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.position.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSkill = skillFilter === "" || alumni.skills.includes(skillFilter)
    const matchesLocation = locationFilter === "" || alumni.location === locationFilter
    const matchesCompany = companyFilter === "" || alumni.company === companyFilter
    const matchesGraduationYear = graduationYearFilter === "" || alumni.graduationYear === graduationYearFilter

    return matchesSearch && matchesSkill && matchesLocation && matchesCompany && matchesGraduationYear
  })

  const resetFilters = () => {
    setSearchQuery("")
    setSkillFilter("")
    setLocationFilter("")
    setCompanyFilter("")
    setGraduationYearFilter("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by name, email, position, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {uniqueSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={graduationYearFilter} onValueChange={setGraduationYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Graduation Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {graduationYears.sort().map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlumniTable data={filteredAlumni} />
    </div>
  )
}
