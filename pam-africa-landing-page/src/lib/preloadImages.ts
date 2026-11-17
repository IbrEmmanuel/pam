export const HERO_IMAGES = [
  "/images/company_logo_hero.png",
  "/images/hero1.png",
  "/images/hero4.png",
  "/images/hero5.png",
  "/images/inverter.png",
  "/images/pam_office.png",
  "/images/logoscroll1.png",
  "/images/logoscroll2.png",
  "/images/afterscroll1.png",
  "/images/logoscroll3.png",
  "/images/afterscoll2.png",
  "/images/logoscroll4.png",
  "/images/afterscroll4.png",
];

function decodeOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(() => resolve()).catch(() => resolve());
        return;
      }
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export async function decodeImage(src: string, retries = 2): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      await decodeOnce(src);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to load ${src}`);
}

export function prefetchImages(sources: string[]) {
  sources.forEach((src) => {
    decodeImage(src, 0).catch(() => {
      // Hero frames are not on the Welcome stage.
    });
  });
}
