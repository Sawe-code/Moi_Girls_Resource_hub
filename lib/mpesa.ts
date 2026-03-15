const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};

export const MPESA_ENV = getEnvVar("MPESA_ENV");
export const MPESA_CONSUMER_KEY = getEnvVar("MPESA_CONSUMER_KEY");
export const MPESA_CONSUMER_SECRET = getEnvVar("MPESA_CONSUMER_SECRET");
export const MPESA_SHORTCODE = getEnvVar("MPESA_SHORTCODE");
export const MPESA_PASSKEY = getEnvVar("MPESA_PASSKEY");
export const MPESA_CALLBACK_URL = getEnvVar("MPESA_CALLBACK_URL");

console.log("========== MPESA DEBUG ==========");
console.log("MPESA ENV:", MPESA_ENV);
console.log(
  "BASE URL:",
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke",
);
console.log("KEY PRESENT:", Boolean(MPESA_CONSUMER_KEY));
console.log("SECRET PRESENT:", Boolean(MPESA_CONSUMER_SECRET));
console.log("SHORTCODE:", MPESA_SHORTCODE);
console.log("CALLBACK URL:", MPESA_CALLBACK_URL);
console.log("=================================");

export const getMpesaBaseUrl = () => {
  return MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
};

export const generateTimestamp = () => {
  const date = new Date();

  // Convert to East Africa Time (UTC+3)
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const eat = new Date(utc + 3 * 60 * 60 * 1000);

  const year = eat.getFullYear();
  const month = String(eat.getMonth() + 1).padStart(2, "0");
  const day = String(eat.getDate()).padStart(2, "0");
  const hours = String(eat.getHours()).padStart(2, "0");
  const minutes = String(eat.getMinutes()).padStart(2, "0");
  const seconds = String(eat.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const generatePassword = (timestamp: string) => {
  const dataToEncode = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`;
  return Buffer.from(dataToEncode).toString("base64");
};

export const normalizeKenyanPhone = (phone: string) => {
  const cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("+254")) return cleaned.slice(1);
  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("0")) return `254${cleaned.slice(1)}`;

  return cleaned;
};

export const getAccessToken = async () => {
  const baseUrl = getMpesaBaseUrl();
  const auth = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`,
  ).toString("base64");

  const res = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    },
  );

  const data = await res.json();

  console.log("===== OAUTH DEBUG =====");
  console.log("OAuth status:", res.status);
  console.log("OAuth response:", data);
  console.log("=======================");

  if (!res.ok) {
    throw new Error(
      data.errorMessage || "Failed to generate M-Pesa access token",
    );
  }

  return data.access_token as string;
};
