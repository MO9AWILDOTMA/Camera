
import Role from "../../models/role.model";

export interface RolesState {
  Roles: Role[];
  loading: boolean;
  error: string | null;
}

export const initialRolesState: RolesState = {
  Roles: [],
  loading: false,
  error: null,
};
