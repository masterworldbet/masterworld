 "use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function LineButton({
  href,
  children = "เริ่มเล่นผ่าน LINE",
  className = "",
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const handleClick = () => {
    // Meta Pixel: records an intentional click toward LINE.
    window.fbq?.("track", "Contact", {
      content_name: "LINE Game Registration",
      content_category: "Game Landing Page",
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`lineButton ${className}`}
    >
      <span className="lineIcon">L</span>
      <span>{children}</span>
      <span className="arrow">→</span>
    </a>
  );
}