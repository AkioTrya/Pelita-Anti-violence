const TICKET_MANAGER_ROLES = new Set(["admin", "dinas", "teacher"]);

export function canManageAllTickets(role: string | undefined): boolean {
  return role !== undefined && TICKET_MANAGER_ROLES.has(role);
}

export function canAccessStaffDashboard(role: string | undefined): boolean {
  return role === "consultant" || canManageAllTickets(role);
}

export function canViewReports(role: string | undefined): boolean {
  return role === "admin" || role === "dinas" || role === "teacher";
}

export function isStaffMessage(role: string): boolean {
  return role === "admin" || role === "consultant" || role === "dinas" || role === "teacher";
}
