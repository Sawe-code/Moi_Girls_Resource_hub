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

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

export type Paper = {
  _id: string;
  title: string;
  subject: string;
  form: string;
  year: number;
  type: string;
  price: number;
  isFree: boolean;
  hasMarkingScheme: boolean;
  fileUrl: string;
  downloadsCount: number;

}

export type FeaturedPapersProps = {
  papers: Paper[];
  loading: boolean;
  error: string;
}