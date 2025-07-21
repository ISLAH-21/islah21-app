export function toCamelCase(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/ (.)/g, (_, c) => c.toUpperCase());
}

export function getInitials(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}
