// proxy.ts
import { NextResponse, type NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const EXPIRY_MARGIN_MINUTES = 5;

function isExpiredOrExpiringSoon(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    const margin = EXPIRY_MARGIN_MINUTES * 60 * 1000;
    return exp - now < margin;
  } catch {
    return true;
  }
}

function clearCookiesAndRedirect(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (pathname.startsWith("/login")) {
    if (accessToken && !isExpiredOrExpiringSoon(accessToken)) {
      return NextResponse.redirect(new URL("/user/audios", request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return clearCookiesAndRedirect(request);
  }

  if (accessToken && !isExpiredOrExpiringSoon(accessToken)) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return clearCookiesAndRedirect(request);
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      console.warn(`Refresh failed: ${res.status}`);
      return clearCookiesAndRedirect(request);
    }

    const data = await res.json();
    const newAccessToken = data.data?.access_token;

    if (!newAccessToken) {
      console.warn("No access_token in refresh response");
      return clearCookiesAndRedirect(request);
    }

    //  1. Mutar el request ANTES de crear la response,
    //    para que cookies() dentro del Server Component vea el token nuevo
    //    en este mismo request.
    request.cookies.set("access_token", newAccessToken);

    //  2. Crear la response pasando el request mutado.
    const response = NextResponse.next({ request });

    // 3. Y también setearlo en la response, para que el navegador
    //    reciba el Set-Cookie y lo guarde para próximas peticiones.
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.JWT_EXPIRES_MIN) * 60 || 60 * 15,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return clearCookiesAndRedirect(request);
  }
}

export const config = {
  matcher: ["/user/:path*", "/login"],
};
