const PROXY_PREFIX = "/backend";
const MEDIA_KEYS = new Set(["audio_url", "waveform_url"]);

function getOrigin(value?: string): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const BACKEND_ORIGIN = getOrigin(process.env.BACKEND_URL);
const PUBLIC_BACKEND_ORIGIN = getOrigin(
  process.env.PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL,
);

function isPrivateHost(hostname: string): boolean {
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  ) {
    return true;
  }

  if (hostname.startsWith("10.") || hostname.startsWith("192.168.")) {
    return true;
  }

  const private172 = /^172\.(\d{1,2})\./.exec(hostname);
  if (private172) {
    const secondOctet = Number(private172[1]);
    return secondOctet >= 16 && secondOctet <= 31;
  }

  // Nombres de servicios internos (Docker/Kubernetes), por ejemplo "backend".
  return !hostname.includes(".");
}

/**
 * Convierte las URLs de audio/waveform del backend en rutas del mismo origen.
 *
 * El navegador nunca llama a la IP interna del backend: llama a
 * /backend/... en el frontend y Next lo reenvía por la red interna.
 * Así funciona tanto dentro como fuera de la VPN.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (url.startsWith(`${PROXY_PREFIX}/`)) return url;
  if (url.startsWith("//")) return resolveMediaUrl(`https:${url}`);
  if (url.startsWith("/")) return `${PROXY_PREFIX}${url}`;

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return url;
    }

    const isBackend =
      parsed.origin === BACKEND_ORIGIN ||
      parsed.origin === PUBLIC_BACKEND_ORIGIN ||
      isPrivateHost(parsed.hostname);

    if (isBackend) {
      return `${PROXY_PREFIX}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    return url;
  } catch {
    return `${PROXY_PREFIX}/${url.replace(/^\/+/, "")}`;
  }
}

export function normalizeMediaUrls<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeMediaUrls(item)) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(
      value as Record<string, unknown>,
    )) {
      result[key] =
        MEDIA_KEYS.has(key) && typeof item === "string"
          ? resolveMediaUrl(item)
          : normalizeMediaUrls(item);
    }

    return result as T;
  }

  return value;
}
