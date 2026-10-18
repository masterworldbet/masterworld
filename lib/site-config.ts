export type SiteConfig = {
  promoImageUrl: string;
  imageAlt: string;
  registerUrl: string;
  buttonText: string;
  showImage: boolean;
  showButton: boolean;
  pageBackgroundColor: string | null;
  cardBackgroundColor: string | null;
  buttonBackgroundColor: string | null;
  buttonTextColor: string | null;
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  promoImageUrl: "/promo-square.png",
  imageAlt: "Masterworld",
  registerUrl: "https://masterworldbet.com/sign-up?ref_agent=1feacd0466b9&ref_zean=9ED5866AF713",
  buttonText: "สมัครเลย",
  showImage: true,
  showButton: true,
  // Null means preserve the original CSS exactly until the owner customizes a color.
  pageBackgroundColor: null,
  cardBackgroundColor: null,
  buttonBackgroundColor: null,
  buttonTextColor: null,
};

const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

function safeImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2000) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2000) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function sanitizeSiteConfig(input: unknown): SiteConfig | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  const promoImageUrl = safeImageUrl(value.promoImageUrl);
  const registerUrl = safeHttpsUrl(value.registerUrl);
  if (!promoImageUrl || !registerUrl) return null;
  if (typeof value.buttonText !== "string" || value.buttonText.trim().length < 1 || value.buttonText.length > 80) return null;
  if (typeof value.imageAlt !== "string" || value.imageAlt.length > 160) return null;
  if (typeof value.showImage !== "boolean" || typeof value.showButton !== "boolean") return null;

  const optionalColor = (key: string): string | null | undefined => {
    const item = value[key];
    if (item === null || item === "") return null;
    return isHexColor(item) ? item : undefined;
  };
  const pageBackgroundColor = optionalColor("pageBackgroundColor");
  const cardBackgroundColor = optionalColor("cardBackgroundColor");
  const buttonBackgroundColor = optionalColor("buttonBackgroundColor");
  const buttonTextColor = optionalColor("buttonTextColor");
  if (pageBackgroundColor === undefined || cardBackgroundColor === undefined || buttonBackgroundColor === undefined || buttonTextColor === undefined) return null;

  return {
    promoImageUrl,
    imageAlt: value.imageAlt,
    registerUrl,
    buttonText: value.buttonText.trim(),
    showImage: value.showImage,
    showButton: value.showButton,
    pageBackgroundColor,
    cardBackgroundColor,
    buttonBackgroundColor,
    buttonTextColor,
  };
}

export function mergeSiteConfig(input: unknown): SiteConfig {
  if (!input || typeof input !== "object" || Array.isArray(input)) return DEFAULT_SITE_CONFIG;
  const merged = { ...DEFAULT_SITE_CONFIG, ...(input as Partial<SiteConfig>) };
  return sanitizeSiteConfig(merged) ?? DEFAULT_SITE_CONFIG;
}
