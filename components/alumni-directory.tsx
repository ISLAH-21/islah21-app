"use client";

import { AlumniTable } from "@/components/alumni-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	Alumni,
	AlumniMetadata,
} from "@/services/alumni/alumni-schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Filters = {
	name: string;
	skills: string;
	location: string;
	company: string;
};

const ALL_SENTINEL = "__all__";

export function AlumniDirectory({
	items,
	totalCount,
	page,
	pageSize,
	filters,
	metadata,
}: {
	items: Alumni[];
	totalCount: number;
	page: number;
	pageSize: number;
	filters: Filters;
	metadata: AlumniMetadata;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();
	const [name, setName] = useState(filters.name);

	useEffect(() => {
		setName(filters.name);
	}, [filters.name]);

	useEffect(() => {
		if (name === filters.name) return;
		const handle = setTimeout(() => {
			updateParams({ name });
		}, 300);
		return () => clearTimeout(handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	function updateParams(updates: Partial<Filters> & { page?: number }) {
		const sp = new URLSearchParams(searchParams.toString());
		for (const [key, rawValue] of Object.entries(updates)) {
			const value = rawValue == null ? "" : String(rawValue);
			if (value) {
				sp.set(key, value);
			} else {
				sp.delete(key);
			}
		}
		if (!("page" in updates)) {
			sp.delete("page");
		}
		startTransition(() => {
			router.replace(sp.toString() ? `/?${sp.toString()}` : "/");
		});
	}

	function resetFilters() {
		setName("");
		startTransition(() => {
			router.replace("/");
		});
	}

	const hasActiveFilters =
		filters.name || filters.skills || filters.location || filters.company;

	return (
		<div className="space-y-6">
			<Card>
				<CardContent className="pt-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
						<div className="lg:col-span-2">
							<Input
								placeholder="Search by name..."
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full"
							/>
						</div>

						<FilterSelect
							placeholder="Skill"
							allLabel="All Skills"
							value={filters.skills}
							options={metadata.skills}
							onChange={(v) => updateParams({ skills: v })}
						/>
						<FilterSelect
							placeholder="Location"
							allLabel="All Locations"
							value={filters.location}
							options={metadata.domiciles}
							onChange={(v) => updateParams({ location: v })}
						/>
						<FilterSelect
							placeholder="Company"
							allLabel="All Companies"
							value={filters.company}
							options={metadata.companies}
							onChange={(v) => updateParams({ company: v })}
						/>
					</div>

					<div className="mt-4 flex justify-end">
						<Button
							variant="outline"
							onClick={resetFilters}
							disabled={!hasActiveFilters}
						>
							Reset Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			<AlumniTable
				items={items}
				page={page}
				pageSize={pageSize}
				totalCount={totalCount}
			/>
		</div>
	);
}

function FilterSelect({
	placeholder,
	allLabel,
	value,
	options,
	onChange,
}: {
	placeholder: string;
	allLabel: string;
	value: string;
	options: string[];
	onChange: (value: string) => void;
}) {
	return (
		<Select
			value={value || ALL_SENTINEL}
			onValueChange={(next) => onChange(next === ALL_SENTINEL ? "" : next)}
		>
			<SelectTrigger>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL_SENTINEL}>{allLabel}</SelectItem>
				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
