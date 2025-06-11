import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes are protected
const isProtectedRoute = createRouteMatcher([
  '/data-vault(.*)',
  '/fake-data(.*)',
  '/breaches(.*)',
  '/dashboard(.*)',
  '/apps(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Await the auth function to get the user data
  const { userId } = await auth();  // Make sure this is awaited properly

  console.log("🔐 Clerk middleware: userId =", userId);

  // Check if the route is protected and user is not authenticated
  if (!userId && isProtectedRoute(req)) {
    console.log("🔒 Redirecting to sign-in...");

    const { redirectToSignIn } = await auth(); // This will handle redirect to sign-in if needed
    return redirectToSignIn();
  }

  return NextResponse.next();  // Continue with the request if authenticated
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // Matches everything except Next.js internals
    '/(api|trpc)(.*)', // Matches API routes (e.g., /api/breaches)
  ],
};
