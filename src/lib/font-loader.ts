import type { FontDefinition } from "./theme-presets";

const loadedFonts = new Set<string>();

export function loadFont(font: FontDefinition): void {
  if (!font.googleFont || loadedFonts.has(font.id)) {
    return;
  }

  try {
    const linkId = `font-${font.id}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
      document.head.appendChild(link);
      loadedFonts.add(font.id);
    }
  } catch (err) {
    console.warn(`[font-loader] Failed to load font ${font.name}:`, err);
  }
}

export function loadGoogleFont(fontName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const formatted = fontName.trim().replace(/\s+/g, "+");
    const linkId = `google-font-${formatted.toLowerCase()}`;

    if (document.getElementById(linkId)) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;500;600;700&display=swap`;

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load Google Font: ${fontName}`));

    document.head.appendChild(link);
  });
}
