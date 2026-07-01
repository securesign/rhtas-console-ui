export type ServiceStatus = "healthy" | "unhealthy" | "unknown";

export type OverallStatus = "Operational" | "Degraded" | "Down";

export type Severity = "danger" | "warning" | "success" | "info";

export function statusToSeverity(status: ServiceStatus): Severity {
  switch (status) {
    case "healthy":
      return "success";
    case "unknown":
      return "warning";
    case "unhealthy":
      return "danger";
  }
}

export function severityColor(severity: Severity): string {
  switch (severity) {
    case "success":
      return "var(--pf-t--global--color--status--success--default)";
    case "warning":
      return "var(--pf-t--global--color--status--warning--default)";
    case "danger":
      return "var(--pf-t--global--color--status--danger--default)";
    case "info":
      return "var(--pf-t--global--color--status--info--default)";
  }
}

export function statusColor(status: ServiceStatus): string {
  return severityColor(statusToSeverity(status));
}
