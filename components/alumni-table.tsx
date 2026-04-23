"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Alumni } from "@/services/alumni/alumni-schema";
import {
	Building,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	Github,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Twitter,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type AlumniLink = Alumni["links"][number];

export function AlumniTable({
	items,
	page,
	pageSize,
	totalCount,
}: {
	items: Alumni[];
	page: number;
	pageSize: number;
	totalCount: number;
}) {
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
	const rangeEnd = Math.min(page * pageSize, totalCount);

	if (items.length === 0) {
		return (
			<div className="rounded-md border p-12 text-center text-muted-foreground">
				No results found.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="hidden md:block">
				<DesktopTable items={items} />
			</div>
			<div className="space-y-4 md:hidden">
				{items.map((alumni) => (
					<MobileCard key={alumni.email || alumni.name} alumni={alumni} />
				))}
			</div>

			{totalPages > 1 && <PaginationBar page={page} totalPages={totalPages} />}

			<div className="text-muted-foreground text-sm">
				Showing {rangeStart}–{rangeEnd} of {totalCount} alumni
			</div>
		</div>
	);
}

function DesktopTable({ items }: { items: Alumni[] }) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[250px]">Name</TableHead>
						<TableHead>Skills</TableHead>
						<TableHead>Location</TableHead>
						<TableHead>Company</TableHead>
						<TableHead>Contact</TableHead>
						<TableHead>Portfolio</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((alumni) => (
						<TableRow key={alumni.email || alumni.name}>
							<TableCell className="font-medium">
								<AlumniIdentity alumni={alumni} />
							</TableCell>
							<TableCell>
								<SkillsBadges alumni={alumni} />
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
								<PortfolioLinks links={alumni.links} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function MobileCard({ alumni }: { alumni: Alumni }) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div className="border-b p-4">
					<AlumniIdentity alumni={alumni} />
				</div>

				<div className="space-y-3 p-4">
					<div>
						<div className="mb-1 font-medium text-sm">Skills</div>
						<SkillsBadges alumni={alumni} />
					</div>

					<div className="grid grid-cols-2 gap-2">
						<IconRow icon={Building}>{alumni.company}</IconRow>
						<IconRow icon={MapPin}>{alumni.domicile}</IconRow>
						<IconRow icon={Mail}>
							<a
								href={`mailto:${alumni.email}`}
								className="truncate text-primary hover:underline"
							>
								{alumni.email}
							</a>
						</IconRow>
					</div>

					{alumni.links.length > 0 && (
						<div>
							<div className="mb-1 font-medium text-sm">Portfolio</div>
							<PortfolioLinks links={alumni.links} />
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function AlumniIdentity({ alumni }: { alumni: Alumni }) {
	return (
		<div className="flex items-center gap-3">
			<Avatar className="h-12 w-12">
				<AvatarImage src="/placeholder.svg" alt={alumni.name} />
				<AvatarFallback>{alumni.name.charAt(0)}</AvatarFallback>
			</Avatar>
			<div>
				<div className="font-medium">{alumni.name}</div>
				<div className="text-muted-foreground text-sm">{alumni.currentJob}</div>
				<div className="text-muted-foreground text-xs">{alumni.company}</div>
			</div>
		</div>
	);
}

function IconRow({
	icon: Icon,
	children,
}: {
	icon: typeof Building;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-1">
			<Icon className="h-4 w-4 text-muted-foreground" />
			<span className="text-sm">{children}</span>
		</div>
	);
}

function SkillsBadges({ alumni }: { alumni: Alumni }) {
	const [expanded, setExpanded] = useState(false);
	const visible = expanded ? alumni.skills : alumni.skills.slice(0, 3);
	const hiddenCount = alumni.skills.length - 3;

	return (
		<div className="flex flex-wrap gap-1">
			{visible.map((skill, index) => (
				<Badge key={`${skill}-${index}`} variant="secondary">
					{skill}
				</Badge>
			))}
			{hiddenCount > 0 && (
				<Badge
					variant="outline"
					className="cursor-pointer hover:bg-muted"
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? "Show less" : `+${hiddenCount}`}
				</Badge>
			)}
		</div>
	);
}

function PortfolioLinks({ links }: { links: Alumni["links"] }) {
	const flattened = links.flatMap(flattenLink);
	if (flattened.length === 0) return null;
	return (
		<div className="flex space-x-1">
			{flattened.map(({ type, value }, index) => (
				<PortfolioLink key={`${type}-${value}-${index}`} type={type} value={value} />
			))}
		</div>
	);
}

function flattenLink(link: AlumniLink): Array<{ type: string; value: string }> {
	if (Array.isArray(link.value)) {
		return link.value.map((v) => ({ type: link.type, value: v }));
	}
	return [{ type: link.type, value: link.value }];
}

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

function getPortfolioIcon(type: string) {
	switch (type.toLowerCase()) {
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
}

function PaginationBar({
	page,
	totalPages,
}: {
	page: number;
	totalPages: number;
}) {
	const searchParams = useSearchParams();

	function hrefForPage(nextPage: number) {
		const sp = new URLSearchParams(searchParams.toString());
		if (nextPage === 1) {
			sp.delete("page");
		} else {
			sp.set("page", String(nextPage));
		}
		return sp.toString() ? `/?${sp.toString()}` : "/";
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PageArrow
						disabled={page <= 1}
						href={hrefForPage(page - 1)}
						label="Previous"
						icon={<ChevronLeft className="h-4 w-4" />}
						iconPosition="start"
					/>
				</PaginationItem>

				{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
					<PaginationItem key={p}>
						<Link
							href={hrefForPage(p)}
							aria-current={page === p ? "page" : undefined}
							className={cn(
								buttonVariants({
									variant: page === p ? "outline" : "ghost",
									size: "icon",
								}),
							)}
						>
							{p}
						</Link>
					</PaginationItem>
				))}

				<PaginationItem>
					<PageArrow
						disabled={page >= totalPages}
						href={hrefForPage(page + 1)}
						label="Next"
						icon={<ChevronRight className="h-4 w-4" />}
						iconPosition="end"
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

function PageArrow({
	disabled,
	href,
	label,
	icon,
	iconPosition,
}: {
	disabled: boolean;
	href: string;
	label: string;
	icon: React.ReactNode;
	iconPosition: "start" | "end";
}) {
	const className = cn(
		buttonVariants({ variant: "ghost", size: "default" }),
		"gap-1",
		iconPosition === "start" ? "pl-2.5" : "pr-2.5",
		disabled && "pointer-events-none opacity-50",
	);

	const content = (
		<>
			{iconPosition === "start" && icon}
			<span>{label}</span>
			{iconPosition === "end" && icon}
		</>
	);

	if (disabled) {
		return (
			<span aria-disabled className={className}>
				{content}
			</span>
		);
	}

	return (
		<Link href={href} aria-label={`Go to ${label.toLowerCase()} page`} className={className}>
			{content}
		</Link>
	);
}
