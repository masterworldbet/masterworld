"use client";

import { ChangeEvent, useEffect, useState } from "react";
import type { CustomButton, SiteConfig, SiteImage } from "../../../lib/site-config";

const defaults: SiteConfig = {
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
  layoutOrder: ["image:legacy-main-image", "main-button"],
  pageBackgroundColor: null,
  cardBackgroundColor: null,
  buttonBackgroundColor: null,
  buttonTextColor: null,
};

const colorDefaults = {
  pageBackgroundColor: "#050505",
  cardBackgroundColor: "#141414",
  buttonBackgroundColor: "#f0a900",
  buttonTextColor: "#171000",
};
type ColorKey = keyof typeof colorDefaults;

const standardEvents = [
  "Lead",
  "Contact",
  "CompleteRegistration",
  "Subscribe",
  "ViewContent",
  "Search",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
];

export default function ContentEditor() {
  const [config, setConfig] = useState<SiteConfig>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "โหลดการตั้งค่าไม่สำเร็จ");
        if (active) setConfig({ ...defaults, ...data.config });
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "โหลดการตั้งค่าไม่สำเร็จ");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function syncLegacyImageFields(images: SiteImage[]) {
    return {
      images,
      promoImageUrl: images[0]?.url ?? "/promo-square.png",
      imageAlt: images[0]?.alt ?? "Masterworld",
      showImage: images[0]?.enabled ?? false,
    };
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError("");
    setMessage("");
    const uploaded: SiteImage[] = [];

    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `อัปโหลด ${file.name} ไม่สำเร็จ`);

        uploaded.push({
          id: `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url: data.url,
          alt: file.name.replace(/\.[^.]+$/, "").slice(0, 160) || "Masterworld",
          enabled: true,
        });
      }

      setConfig((current) => {
        const images = [...(current.images ?? []), ...uploaded];
        return { ...current, ...syncLegacyImageFields(images) };
      });
      setMessage(`อัปโหลดรูปสำเร็จ ${uploaded.length} รูป อย่าลืมกดบันทึกการเปลี่ยนแปลง`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  function updateImage(id: string, patch: Partial<SiteImage>) {
    setConfig((current) => {
      const images = (current.images ?? []).map((image) =>
        image.id === id ? { ...image, ...patch } : image
      );
      return { ...current, ...syncLegacyImageFields(images) };
    });
    setMessage("");
  }

  function moveImage(index: number, direction: -1 | 1) {
    setConfig((current) => {
      const images = [...(current.images ?? [])];
      const target = index + direction;
      if (target < 0 || target >= images.length) return current;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...current, ...syncLegacyImageFields(images) };
    });
    setMessage("");
  }

  function removeImage(id: string) {
    setConfig((current) => {
      const images = (current.images ?? []).filter((image) => image.id !== id);
      return { ...current, ...syncLegacyImageFields(images) };
    });
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
      setConfig({ ...defaults, ...data.config });
      setMessage("บันทึกแล้ว หน้าเว็บหลักจะใช้การตั้งค่าใหม่นี้");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  function addCustomButton() {
    if (config.customButtons.length >= 20) {
      setError("เพิ่มปุ่มได้สูงสุด 20 ปุ่ม");
      return;
    }
    const button: CustomButton = {
      id: `button-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: "ปุ่มใหม่",
      url: "https://example.com",
      backgroundColor: "#f0a900",
      textColor: "#171000",
      size: "medium",
      align: "center",
      enabled: true,
      eventType: "none",
      eventName: "",
    };
    update("customButtons", [...config.customButtons, button]);
