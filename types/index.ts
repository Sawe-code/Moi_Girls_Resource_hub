export type NavbarProps = {
  isLoggedIn: boolean;
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  hasLoggedInBefore: boolean;
  isFirstLogin: boolean;
  lastLoginAt: string | null;
}