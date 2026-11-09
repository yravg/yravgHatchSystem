// D02 (deny default): owner all outlets of the tenant; manager approves refund and manual price; cashier session and
// checkout; kitchen orders; technician devices. ASSUMPTION: the permission strings and the MFA-required roles below are
// recommended fixtures until the owner locks D02/D24; a later ticket may add permissions, never silently widen a role.
export const ROLES = ["owner", "manager", "cashier", "kitchen", "technician"] as const;
export type Role = (typeof ROLES)[number];

const OWNER = [
  "staff.read", "staff.manage", "mfa.revoke.other", "outlet.config", "report.read",
  "refund.approve", "price.override", "session.manage", "checkout", "order.kitchen", "device.manage",
  "station.manage", "rate.manage",
] as const;

export const ROLE_PERMISSIONS: Readonly<Record<Role, readonly string[]>> = {
  owner: OWNER,
  manager: ["staff.read", "report.read", "refund.approve", "price.override", "session.manage", "checkout", "station.manage"],
  cashier: ["session.manage", "checkout"],
  kitchen: ["order.kitchen"],
  technician: ["device.manage"],
};

/** Roles that must hold a verified second factor (fail closed when it is missing). */
export const MFA_REQUIRED_ROLES: ReadonlySet<Role> = new Set<Role>(["owner", "manager"]);

/** Permissions that also need a fresh step-up, whatever the role. */
export const STEP_UP_PERMISSIONS: ReadonlySet<string> = new Set([
  "refund.approve", "price.override", "staff.manage", "mfa.revoke.other", "outlet.config",
]);

export const permissionsFor = (roles: readonly Role[]): ReadonlySet<string> =>
  new Set(roles.flatMap((r) => ROLE_PERMISSIONS[r]));

export const requiresMfa = (roles: readonly Role[]): boolean => roles.some((r) => MFA_REQUIRED_ROLES.has(r));
