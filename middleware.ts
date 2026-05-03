import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Allow full app on subdomain
  if (host.startsWith("app.")) {
    return NextResponse.next();
  }

  // Main domain → force landing page only
  if (host === "deliveryignite.com" || host === "www.deliveryignite.com") {
    if (url.pathname !== "/") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
