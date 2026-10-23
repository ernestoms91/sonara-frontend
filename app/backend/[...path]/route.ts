//app/backend/%5B...path%5D/route.ts
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/+$/, "");

const REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "if-none-match",
  "if-modified-since",
  "if-range",
  "range",
];

const RESPONSE_HEADERS = [
  "accept-ranges",
  "cache-control",
  "content-disposition",
  "content-length",
  "content-range",
  "content-type",
  "etag",
  "last-modified",
  "vary",
];

/**
 * Proxy de medios del mismo origen.
 *
 * El navegador pide /backend/... al frontend y este Route Handler reenvía la
 * petición al backend por la red interna. Así los audios y waveforms cargan
 * igual desde dentro y desde fuera de la VPN, sin CORS ni IPs privadas.
 */
async function proxyMedia(request: NextRequest) {
  if (!BACKEND_URL) {
    return Response.json(
      { error: "BACKEND_URL no está configurado" },
      { status: 500 },
    );
  }

  const backendPath = request.nextUrl.pathname.replace(/^\/backend/, "") || "/";
  const target = new URL(
    `${backendPath}${request.nextUrl.search}`,
    `${BACKEND_URL}/`,
  );

  const headers = new Headers();
  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let upstream: Response;

  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      redirect: "follow",
      cache: "no-store",
    });
  } catch (error) {
    console.error("Error al proxyficar medio:", error);
    return Response.json(
      { error: "No se pudo conectar con el backend" },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  for (const name of RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return proxyMedia(request);
}

export async function HEAD(request: NextRequest) {
  return proxyMedia(request);
}
