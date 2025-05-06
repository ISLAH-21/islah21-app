"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlumniTable } from "@/components/alumni-table";
import {
	extractAlumniInfo,
	type Alumni,
} from "@/services/alumni/alumni-schema";

export function AlumniDirectory({ alumni }: { alumni: Alumni[] }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [skillFilter, setSkillFilter] = useState("");
	const [locationFilter, setLocationFilter] = useState("");
	const [companyFilter, setCompanyFilter] = useState("");

	const { companies, domiciles, skills } = extractAlumniInfo(alumni);

	const filteredAlumni = alumni.filter((alumni) => {
		const matchesSearch =
			searchQuery === "" ||
			alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			alumni.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
			alumni.currentJob.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesSkill =
			skillFilter === "" || alumni.skills.includes(skillFilter);
		const matchesLocation =
			locationFilter === "" || alumni.domicile === locationFilter;
		const matchesCompany =
			companyFilter === "" || alumni.company === companyFilter;

		return matchesSearch && matchesSkill && matchesLocation && matchesCompany;
	});

	const resetFilters = () => {
		setSearchQuery("");
		setSkillFilter("");
		setLocationFilter("");
		setCompanyFilter("");
	};

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
							<Select
								value={skillFilter}
								onValueChange={(skill) =>
									setSkillFilter(skill !== "all" ? skill : "")
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Skill" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Skills</SelectItem>
									{skills.map((skill) => (
										<SelectItem key={skill} value={skill}>
											{skill}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Select
								value={locationFilter}
								onValueChange={(location) =>
									setLocationFilter(location !== "all" ? location : "")
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Locations</SelectItem>
									{domiciles.map((location) => (
										<SelectItem key={location} value={location}>
											{location}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Select
								value={companyFilter}
								onValueChange={(company) =>
									setCompanyFilter(company !== "all" ? company : "")
								}
							>
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
	);
}
