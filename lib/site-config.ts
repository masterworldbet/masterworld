export type CustomButton = {
  id: string;
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  size: "small" | "medium" | "large";
  align: "left" | "center" | "right";
  enabled: boolean;
  eventType?: "none" | "standard" | "custom";
  eventName?: string;
};

export type SiteImage = { id: string; url: string; alt: string; enabled: boolean };

export type SiteConfig = {
  customButtons: CustomButton[];
  images: SiteImage[];
  promoImageUrl: string;
  imageAlt: string;
  registerUrl: string;
  buttonText: string;
  pixelId: string;
  mainButtonEventType: "none" | "standard" | "custom";
  mainButtonEventName: string;
  showImage: boolean;
  showButton: boolean;
  buttonPlacement: "above" | "below" | "overlay-top" | "overlay-bottom";
  pageBackgroundColor: string | null;
  cardBackgroundColor: string | null;
  buttonBackgroundColor: string | null;
  buttonTextColor: string | null;
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  customButtons: [],
  images: [{ id: "legacy-main-image", url: "/promo-square.png", alt: "Masterworld", enabled: true }],
  promoImageUrl: "/promo-square.png",
  imageAlt: "Masterworld",
  registerUrl: "https://masterworldbet.com/sign-up?ref_agent=1feacd0466b9&ref_zean=9ED5866AF713",
  buttonText: "สมัครเลย",
  pixelId: "",
  mainButtonEventType: "none",
  mainButtonEventName: "",
  showImage: true,
  showButton: true,
  buttonPlacement: "below",
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
  const pixelId = typeof value.pixelId === "string" && value.pixelId.trim().length <= 100 && /^[0-9,\s]*$/.test(value.pixelId) ? value.pixelId.trim() : null;
  const mainButtonEventType = ["none", "standard", "custom"].includes(String(value.mainButtonEventType ?? "none")) ? String(value.mainButtonEventType ?? "none") as "none" | "standard" | "custom" : null;
  const mainButtonEventName = typeof value.mainButtonEventName === "string" && value.mainButtonEventName.length <= 80 ? value.mainButtonEventName.trim() : null;
  if (pixelId === null || mainButtonEventType === null || mainButtonEventName === null) return null;
  if (typeof value.showImage !== "boolean" || typeof value.showButton !== "boolean") return null;

  const buttonPlacement = ["above", "below", "overlay-top", "overlay-bottom"].includes(String(value.buttonPlacement))
    ? value.buttonPlacement as SiteConfig["buttonPlacement"]
    : "below";

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
        !["left", "center", "right"].includes(String(button.align)) || typeof button.enabled !== "boolean" ||
        !["none", "standard", "custom"].includes(String(button.eventType ?? "none")) ||
        (button.eventName !== undefined && (typeof button.eventName !== "string" || button.eventName.length > 80))) return null;
    customButtons.push({
      id: button.id, text: button.text.trim(), url,
      backgroundColor: button.backgroundColor, textColor: button.textColor,
      size: button.size as CustomButton["size"], align: button.align as CustomButton["align"], enabled: button.enabled,
      eventType: (button.eventType ?? "none") as CustomButton["eventType"], eventName: typeof button.eventName === "string" ? button.eventName.trim() : "",
    });
  }

  const rawImages = value.images === undefined
    ? [{ id: "legacy-main-image", url: promoImageUrl, alt: value.imageAlt, enabled: value.showImage }]
    : value.images;
  if (!Array.isArray(rawImages) || rawImages.length > 50) return null;
  const images: SiteImage[] = [];
  for (const raw of rawImages) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const image = raw as Record<string, unknown>;
    const url = safeImageUrl(image.url);
    if (typeof image.id !== "string" || image.id.length < 1 || image.id.length > 100 || !url ||
        typeof image.alt !== "string" || image.alt.length > 160 || typeof image.enabled !== "boolean") return null;
    images.push({ id: image.id, url, alt: image.alt, enabled: image.enabled });
  }
  const firstImage = images[0];

  return {
    customButtons,
    images,
    promoImageUrl: firstImage?.url ?? promoImageUrl,
    imageAlt: firstImage?.alt ?? value.imageAlt,
    registerUrl,
    buttonText: value.buttonText.trim(),
    pixelId, mainButtonEventType, mainButtonEventName,
    showImage: firstImage?.enabled ?? value.showImage,
    showButton: value.showButton,
    buttonPlacement,
    pageBackgroundColor,
    cardBackgroundColor,
    buttonBackgroundColor,
    buttonTextColor,
  };
}

export function mergeSiteConfig(input: unknown): SiteConfig {
  if (!input || typeof input !== "object" || Array.isArray(input)) return DEFAULT_SITE_CONFIG;
  const source = input as Partial<SiteConfig>;
  const merged = { ...DEFAULT_SITE_CONFIG, ...source };
  // Migrate existing saved configurations that predate the multi-image gallery.
  if (!Array.isArray(source.images) && typeof source.promoImageUrl === "string") {
    merged.images = [{ id: "legacy-main-image", url: source.promoImageUrl, alt: source.imageAlt || "Masterworld", enabled: source.showImage ?? true }];
  }
  return sanitizeSiteConfig(merged) ?? DEFAULT_SITE_CONFIG;
}
