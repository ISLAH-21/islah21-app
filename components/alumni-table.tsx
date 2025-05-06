"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChevronDown,
	ChevronUp,
	ChevronsUpDown,
	ExternalLink,
	Github,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Twitter,
	Building,
	GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMobile } from "@/hooks/use-mobile";
import type { Alumni } from "@/services/alumni/alumni-schema";

interface AlumniTableProps {
	data: Alumni[];
}

export function AlumniTable({ data }: AlumniTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState<keyof Alumni | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>(
		{},
	);
	const isMobile = useMobile();

	const itemsPerPage = 10;
	const totalPages = Math.ceil(data.length / itemsPerPage);

	// Sort data if sort field is set
	const sortedData = [...data].sort((a, b) => {
		if (!sortField) return 0;

		const aValue = a[sortField];
		const bValue = b[sortField];

		if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
		if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
		return 0;
	});

	// Get current page data
	const currentData = sortedData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const handleSort = (field: keyof Alumni) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const getSortIcon = (field: keyof Alumni) => {
		if (sortField !== field) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
		return sortDirection === "asc" ? (
			<ChevronUp className="ml-2 h-4 w-4" />
		) : (
			<ChevronDown className="ml-2 h-4 w-4" />
		);
	};

	const toggleSkillsExpansion = (id: string) => {
		setExpandedSkills((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	// Mobile card view
	if (isMobile) {
		return (
			<div className="space-y-6">
				<div className="space-y-4">
					{currentData.map((alumni) => (
						<Card key={alumni.name} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="border-b p-4">
									<div className="flex items-center gap-3">
										<Avatar className="h-12 w-12">
											<AvatarImage src={"/placeholder.svg"} alt={alumni.name} />
											<AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium text-lg">{alumni.name}</div>
											<div className="text-muted-foreground text-sm">
												{alumni.currentJob}
											</div>
											<div className="text-muted-foreground text-xs">
												{alumni.company}
											</div>
										</div>
									</div>
								</div>

								<div className="space-y-3 p-4">
									<div>
										<div className="mb-1 font-medium text-sm">Skills</div>
										<div className="flex flex-wrap gap-1">
											{alumni.skills
												.slice(
													0,
													expandedSkills[alumni.name]
														? alumni.skills.length
														: 3,
												)
												.map((skill, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="mr-1"
													>
														{skill}
													</Badge>
												))}
											{!expandedSkills[alumni.name] &&
												alumni.skills.length > 3 && (
													<Badge
														variant="outline"
														className="cursor-pointer hover:bg-muted"
														onClick={() => toggleSkillsExpansion(alumni.name)}
													>
														+{alumni.skills.length - 3}
													</Badge>
												)}
											{expandedSkills[alumni.name] &&
												alumni.skills.length > 3 && (
													<Badge
														variant="outline"
														className="cursor-pointer hover:bg-muted"
														onClick={() => toggleSkillsExpansion(alumni.name)}
													>
														Show less
													</Badge>
												)}
										</div>
									</div>

									<div className="grid grid-cols-2 gap-2">
										<div className="flex items-center gap-1">
											<Building className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{alumni.company}</span>
										</div>
										<div className="flex items-center gap-1">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{alumni.domicile}</span>
										</div>
										<div className="flex items-center gap-1">
											<Mail className="h-4 w-4 text-muted-foreground" />
											<a
												href={`mailto:${alumni.email}`}
												className="truncate text-primary text-sm hover:underline"
											>
												{alumni.email}
											</a>
										</div>
									</div>

									<div>
										<div className="mb-1 font-medium text-sm">Portfolio</div>
										<div className="flex space-x-1">
											{alumni.links.map((link) => {
												if (
													link.type === "others" ||
													Array.isArray(link.value)
												) {
													if (typeof link.value === "string") {
														return (
															<PortfolioLink
																type={link.type}
																value={link.value}
															/>
														);
													}
													return link.value.map((val) => (
														<PortfolioLink
															key={link.type + val}
															type={link.type}
															value={val}
														/>
													));
												}
												return (
													<PortfolioLink
														key={link.type + link.value}
														type={link.type}
														value={link.value}
													/>
												);
											})}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{totalPages > 1 && (
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										setCurrentPage((prev) => Math.max(prev - 1, 1))
									}
									className={
										currentPage === 1
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>

							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(page) => (
									<PaginationItem key={page}>
										<PaginationLink
											onClick={() => setCurrentPage(page)}
											isActive={currentPage === page}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								),
							)}

							<PaginationItem>
								<PaginationNext
									onClick={() =>
										setCurrentPage((prev) => Math.min(prev + 1, totalPages))
									}
									className={
										currentPage === totalPages
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}

				<div className="text-muted-foreground text-sm">
					Showing {currentData.length} of {data.length} alumni
				</div>
			</div>
		);
	}

	// Desktop table view
	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">
								<button
									className="flex items-center font-medium"
									onClick={() => handleSort("name")}
								>
									Name {getSortIcon("name")}
								</button>
							</TableHead>
							<TableHead>
								<button className="flex items-center font-medium">
									Skills
								</button>
							</TableHead>
							<TableHead>
								<button
									className="flex items-center font-medium"
									onClick={() => handleSort("domicile")}
								>
									Location {getSortIcon("domicile")}
								</button>
							</TableHead>
							<TableHead>
								<button
									className="flex items-center font-medium"
									onClick={() => handleSort("company")}
								>
									Company {getSortIcon("company")}
								</button>
							</TableHead>
							<TableHead>Contact</TableHead>
							<TableHead>Portfolio</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentData.length > 0 ? (
							currentData.map((alumni) => (
								<TableRow key={alumni.name}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage
													src={"/placeholder.svg"}
													alt={alumni.name}
												/>
												<AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{alumni.name}</div>
												<div className="text-muted-foreground text-sm">
													{alumni.currentJob}
												</div>
												<div className="text-muted-foreground text-xs">
													{alumni.company}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{alumni.skills
												.slice(
													0,
													expandedSkills[alumni.name]
														? alumni.skills.length
														: 3,
												)
												.map((skill, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="mr-1"
													>
														{skill}
													</Badge>
												))}
											{!expandedSkills[alumni.name] &&
												alumni.skills.length > 3 && (
													<Badge
														variant="outline"
														className="cursor-pointer hover:bg-muted"
														onClick={() => toggleSkillsExpansion(alumni.name)}
													>
														+{alumni.skills.length - 3}
													</Badge>
												)}
											{expandedSkills[alumni.name] &&
												alumni.skills.length > 3 && (
													<Badge
														variant="outline"
														className="cursor-pointer hover:bg-muted"
														onClick={() => toggleSkillsExpansion(alumni.name)}
													>
														Show less
													</Badge>
												)}
										</div>
									</TableCell>
									<TableCell>{alumni.domicile}</TableCell>
									<TableCell>{alumni.company}</TableCell>
									<TableCell>
										<a
											href={`mailto:${alumni.email}`}
											className="text-primary hover:underline"
										>
											{alumni.email}
										</a>
									</TableCell>
									<TableCell>
										<div className="flex space-x-1">
											{alumni.links.map((link) => {
												if (
													link.type === "others" ||
													Array.isArray(link.value)
												) {
													if (typeof link.value === "string") {
														return (
															<PortfolioLink
																type={link.type}
																value={link.value}
															/>
														);
													}
													return link.value.map((val) => (
														<PortfolioLink
															key={link.type + val}
															type={link.type}
															value={val}
														/>
													));
												}
												return (
													<PortfolioLink
														key={link.type + link.value}
														type={link.type}
														value={link.value}
													/>
												);
											})}
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
									No results found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								className={
									currentPage === 1
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									onClick={() => setCurrentPage(page)}
									isActive={currentPage === page}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								className={
									currentPage === totalPages
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}

			<div className="text-muted-foreground text-sm">
				Showing {currentData.length} of {data.length} alumni
			</div>
		</div>
	);
}

const getPortfolioIcon = (portfolioType: string) => {
	switch (portfolioType.toLowerCase()) {
		case "github":
			return <Github className="h-4 w-4" />;
		case "linkedin":
			return <Linkedin className="h-4 w-4" />;
		case "instagram":
			return <Instagram className="h-4 w-4" />;
		case "twitter":
			return <Twitter className="h-4 w-4" />;
		default:
			return <ExternalLink className="h-4 w-4" />;
	}
};

function PortfolioLink({ value, type }: { value: string; type: string }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="ghost" size="icon" asChild>
						<a href={value} target="_blank" rel="noopener noreferrer">
							{getPortfolioIcon(type)}
						</a>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{type}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
