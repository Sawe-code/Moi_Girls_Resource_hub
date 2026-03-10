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
  downloadsCount?: number;
};

export type Bundle = {
  _id: string;
  title: string;
  subtitle: string;
  tag: string;
  price: number;
  oldPrice: number;
  access: string;
  papersCount: number;
};

export type BundleDetails = {
  _id: string;
  title: string;
  subtitle: string;
  tag: string;
  price: number;
  oldPrice: number;
  access: string;
  papersCount: number;
  papers: Paper[];
};

export type FeaturedPapersProps = {
  papers: Paper[];
  loading: boolean;
  error: string;
};

export type PopularBundlesProps = {
  bundles: Bundle[];
  loading: boolean;
  error: string;
};