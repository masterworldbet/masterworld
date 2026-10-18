export type CustomButton = {
  id: string;
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  size: "small" | "medium" | "large";
  align: "left" | "center" | "right";
  enabled: boolean;
};

export type SiteConfig = {
  customButtons: CustomButton[];
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
  customButtons: [],
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

  const rawButtons = value.customButtons === undefined ? [] : value.customButtons;
  if (!Array.isArray(rawButtons) || rawButtons.length > 20) return null;
  const customButtons: CustomButton[] = [];
  for (const raw of rawButtons) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const button = raw as Record<string, unknown>;
    const url = safeHttpsUrl(button.url);
    if (typeof button.id !== "string" || button.id.length < 1 || button.id.length > 80 ||
        typeof button.text !== "string" || button.text.trim().length < 1 || button.text.length > 80 || !url ||
        !isHexColor(button.backgroundColor) || !isHexColor(button.textColor) ||
        !["small", "medium", "large"].includes(String(button.size)) ||
        !["left", "center", "right"].includes(String(button.align)) || typeof button.enabled !== "boolean") return null;
    customButtons.push({
      id: button.id, text: button.text.trim(), url,
      backgroundColor: button.backgroundColor, textColor: button.textColor,
      size: button.size as CustomButton["size"], align: button.align as CustomButton["align"], enabled: button.enabled,
    });
  }

  return {
    customButtons,
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
