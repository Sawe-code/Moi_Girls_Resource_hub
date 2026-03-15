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
};

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
};

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

export type PurchasePayment = {
  _id: string;
  phone: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  reference: string;
  paymentMethod: string;
  createdAt: string;
  paper?: {
    _id: string;
    title: string;
  } | null;
  bundle?: {
    _id: string;
    title: string;
  } | null;
};

export type AdminOverviewStats = {
  totalStudents: number;
  totalPapers: number;
  totalBundles: number;
  totalRevenue: number;
};

export type AdminRecentPayment = {
  id: string;
  name: string;
  item: string;
  amount: string;
  date: string;
  status: "pending" | "completed" | "failed";
};

export type AdminRecentUser = {
  id: string;
  name: string;
  email: string;
};

export type AdminLatestPaper = {
  id: string;
  title: string;
  subject: string;
};

export type AdminPaymentSummary = {
  completed: number;
  pending: number;
  failed: number;
};

export type AdminRevenueChartItem = {
  month: string;
  revenue: number;
};
export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string | null;
  hasLoggedInBefore?: boolean;
};
export type AdminPayment = {
  _id: string;
  studentName: string;
  studentEmail: string;
  itemTitle: string;
  itemType: "Paper" | "Bundle" | "Unknown";
  amount: number;
  phone: string;
  reference: string;
  paymentMethod: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
};

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string | null;
  hasLoggedInBefore?: boolean;
};
