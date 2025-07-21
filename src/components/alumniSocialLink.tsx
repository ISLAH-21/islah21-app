"use client";

import { cn } from "@/lib/utils";
import type React from "react";

interface AlumniSocialLinkProps {
  href?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
  iconClassName?: string;
}

export default function ALumniSocialLink({
  href,
  Icon,
  className,
  iconClassName,
}: AlumniSocialLinkProps) {
  return (
    <a
      className={cn(
        `group flex size-8 items-center justify-center rounded-full bg-slate-100 hover:cursor-pointer`,
        className,
      )}
      target="_blank"
      href={href}
    >
      <Icon className={iconClassName} />
    </a>
  );
}
