import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Skip API routes, internal Next.js paths, static files
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
