import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very
  // hard to debug issues with users being randomly logged out.
  //
  // IMPORTANT: Use getUser() instead of getSession() in server code.
  // getUser() is safe and hits the Supabase Auth server.
  // getSession() reads from cookies which can be tampered with.
  await supabase.auth.getUser();

  // Optional: redirect unauthenticated users to login
  // Uncomment when auth is implemented
  //
  // const { data: { user } } = await supabase.auth.getUser();
  // if (
  //   !user &&
  //   !request.nextUrl.pathname.startsWith("/login") &&
  //   !request.nextUrl.pathname.startsWith("/auth") &&
  //   !request.nextUrl.pathname.startsWith("/checkout") === false
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  // IMPORTANT: Return the supabaseResponse object as-is.
  // If you need a new response, copy all cookies from supabaseResponse:
  //
  // const newResponse = NextResponse.next({ request });
  // newResponse.headers.forEach((value, key) => {
  //   supabaseResponse.headers.set(key, value);
  // });
  // supabaseResponse.cookies.getAll().forEach(cookie => {
  //   newResponse.cookies.set(cookie.name, cookie.value);
  // });

  return supabaseResponse;
}
