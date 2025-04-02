export default interface Role {
  id: number;
  name: ERole
}

export enum ERole {
  ROLE_ADMIN=("ROLE_ADMIN"), ROLE_CINEPHILE=("ROLE_CINEPHILE"), ROLE_MODERATOR=("ROLE_MODERATOR")
}
