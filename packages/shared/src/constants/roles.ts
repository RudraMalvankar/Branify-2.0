export const ROLES = ['user', 'admin'] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_HIERARCHY: Record<Role, number> = {
  user: 0,
  admin: 1,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}