const dummyPapers = [
  {
    id: "1",
    title: "Form 4 Chemistry Mock Term 2",
    subject: "Chemistry",
    form: "Form 4",
    year: "2024",
    type: "Mock",
    price: 50,
    isFree: false,
  },
  {
    id: "2",
    title: "KCSE Mathematics Paper 1",
    subject: "Mathematics",
    form: "Form 4",
    year: "2023",
    type: "KCSE",
    price: 0,
    isFree: true,
  },
  {
    id: "3",
    title: "English End Term Exam",
    subject: "English",
    form: "Form 3",
    year: "2022",
    type: "End Term",
    price: 30,
    isFree: false,
  },
];

const bundles = [
  {
    id: "b1",
    title: "Form 4 Comprehensive Mock Revision Pack",
    subtitle: "Moi Girls Mock Exams • 2022–2025",
    papersCount: 120,
    access: "Includes marking schemes where available",
    price: 350,
    oldPrice: 600,
    tag: "Most Accessed",
  },
  {
    id: "b2",
    title: "KCSE Past Papers Collection",
    subtitle: "Paper 1 & 2 • 2016–2024",
    papersCount: 80,
    access: "Organized by subject and year",
    price: 250,
    oldPrice: 450,
    tag: "Recommended",
  },
  {
    id: "b3",
    title: "Form 1–3 Termly Revision Bundle",
    subtitle: "End-Term + Topical Exams",
    papersCount: 60,
    access: "Structured for continuous assessment practice",
    price: 200,
    oldPrice: 300,
    tag: "Form 1–3",
  },
];

const testimonials = [
  {
    name: "Shanique Ngaira",
    role: "Form 4 Student",
    quote:
      "The papers were well organized and accurate. Helped me revise faster and smarter.",
    stars: 5,
  },
  {
    name: "Marion ChepChumba",
    role: "KCSE Candidate",
    quote:
      "Instant access after payment. The mock pack was worth it—especially the marking schemes.",
    stars: 5,
  },
  {
    name: "Faith Cherono",
    role: "Parent",
    quote:
      "Easy to use and affordable. My child got exactly what they needed for revision.",
    stars: 4,
  },
  {
    name: "Mr. Mwangi",
    role: "Teacher",
    quote:
      "Great resource hub. It’s clean, reliable, and saves students a lot of time searching.",
    stars: 5,
  },
];

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description:
      "Sign up to access the Moi Girls exam resource portal and browse available papers.",
  },
  {
    number: "02",
    title: "Select & Pay",
    description:
      "Choose your desired paper or revision bundle and complete payment securely via M-Pesa.",
  },
  {
    number: "03",
    title: "Download & Revise",
    description:
      "Access your purchased papers instantly from your dashboard and begin revision.",
  },
];
const reasons = [
  {
    title: "Verified & Organized Resources",
    desc: "Access official Moi Girls mock exams and past papers organized by form, subject, year, and exam type.",
    icon: "/icons/check.png",
  },
  {
    title: "Secure M-Pesa Payments",
    desc: "Complete payments safely via M-Pesa and receive immediate access to your selected papers or bundles.",
    icon: "/icons/bolt.png",
  },
  {
    title: "Structured Revision Bundles",
    desc: "Comprehensive revision packs designed to provide multiple exam papers at a reduced overall cost.",
    icon: "/icons/tag.png",
  },
  {
    title: "Marking Schemes Where Available",
    desc: "Selected papers include marking schemes to guide proper answer structure and exam technique.",
    icon: "/icons/book.png",
  },
  {
    title: "Secure & Reliable Access",
    desc: "Your purchased resources remain accessible in your dashboard for continued revision.",
    icon: "/icons/lock.png",
  },
  {
    title: "Focused on Academic Excellence",
    desc: "Resources prepared to support KCSE preparation and continuous assessment improvement.",
    icon: "/icons/target.png",
  },
];

const stats = [
  { value: "1,200+", label: "Verified Exam Papers" },
  { value: "800+", label: "Moi Girls Students Using Portal" },
  { value: "10+", label: "Subjects Covered" },
  { value: "4+", label: "Years of Mock Exams" },
];

const faqs = [
  {
    question: "How do I pay for papers?",
    answer:
      "Payments are completed securely via M-Pesa. Once your payment is successfully confirmed, access to the selected paper or bundle is granted.",
  },
  {
    question: "When do I get access after payment?",
    answer:
      "Access is granted immediately after successful M-Pesa confirmation. You can download your purchased papers from your dashboard.",
  },
  {
    question: "Are marking schemes included?",
    answer:
      "Selected papers include marking schemes where available to support proper answer structure and exam preparation.",
  },
  {
    question: "Can I download papers multiple times?",
    answer:
      "Yes. Once purchased, your papers remain available in your dashboard for repeated download and revision.",
  },
  {
    question: "Is payment secure?",
    answer:
      "Yes. All payments are processed securely via M-Pesa, and your account information is protected within the portal.",
  },
  {
    question: "Are these official Moi Girls resources?",
    answer:
      "Yes. The portal provides authorized Moi Girls mock exams and past papers organized for structured revision.",
  },
];

export { dummyPapers, bundles, testimonials, steps, reasons, stats, faqs };
