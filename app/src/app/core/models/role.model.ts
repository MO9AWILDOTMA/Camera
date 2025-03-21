export default interface Role {
  id: number;
  name: ERole
}

export enum ERole {
  ROLE_ADMIN=("Admin"), ROLE_CINEPHILE=("Cinephile"), ROLE_MODERATOR=("Moderator")
}
