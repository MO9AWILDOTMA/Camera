import User from "../../models/user.model";

export interface UsersState {
  Users: User[];
  loading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  Users: [],
  loading: false,
  error: null,
};
