
import Role from "../../models/role.model";

export interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

export const initialRoleState: RoleState = {
  roles: [],
  loading: false,
  error: null,
};
