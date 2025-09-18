// Role interface
export interface Role {
  roleId: number;
  roleUuid: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// UserRole interface
export interface UserRole {
  userRoleId: number;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

// Permissions interface
export interface Permissions {
  can_read: boolean;
  can_write: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_export: boolean;
  can_publish: boolean;
}

// Component interface
export interface Component {
  component_name: string;
  permissions: Permissions;
}

// Section interface
export interface Section {
  section_name: string;
  components: Component[];
}

// RolePermission interface
export interface RolePermission {
  service_name: string;
  service_sections: Section[];
}

// User interface
export interface User {
  userId: number;
  google_id: string | null;
  facebook_id: string | null;
  name: string;
  email: string;
  isActive: boolean;
  emailVerificationCode: string | null;
  isVerified: boolean;
  refreshToken: string;
  profile_image: string | null;
  createdAt: string;
  updatedAt: string;
  userRoles: UserRole[];
}

// AuthResponse interface
export interface AuthResponse {
  user: {
    user: User;
    rolePermissions: RolePermission[];
  };
}
