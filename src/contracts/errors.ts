export type StudioErrorCode =
  | "SCHEMA_UNSUPPORTED_VERSION"
  | "SCHEMA_INVALID"
  | "DUPLICATE_SLIDE_ID"
  | "UNKNOWN_LAYOUT"
  | "JSON_PARSE"
  | "IMPORT_TOO_LARGE"
  | "FACT_MISSING"
  | "FACT_UNVERIFIED"
  | "ASSET_MISSING"
  | "ASSET_NOT_VECTOR"
  | "ASSET_UNAPPROVED"
  | "TEXT_OVERFLOW"
  | "RENDERER_UNAVAILABLE"
  | "STORAGE_UNAVAILABLE"
  | "STORAGE_CORRUPT"
  | "STORAGE_QUOTA";

export interface StudioIssue {
  code: StudioErrorCode;
  /** JSON-pointer-ish path, e.g. `slides[2].props.title`. Empty for whole-document issues. */
  path: string;
  message: string;
}

export function issue(code: StudioErrorCode, path: string, message: string): StudioIssue {
  return { code, path, message };
}

/** Human-readable summary for a list of issues. */
export function summarize(issues: readonly StudioIssue[]): string {
  if (issues.length === 0) return "Tidak ada masalah.";
  if (issues.length === 1) return issues[0]!.message;
  return `${issues.length} masalah: ${issues[0]!.message}`;
}
