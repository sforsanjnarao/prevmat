import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/data-vault(.*)',
  '/fake-data(.*)',
  '/breaches(.*)',
  '/dashboard(.*)',
  '/apps(.*)',
]);


//like jwt but with clerk
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); 

  console.log("🔐 Clerk middleware: userId =", userId);

  if (!userId && isProtectedRoute(req)) {
    console.log("🔒 Redirecting to sign-in...");

    const { redirectToSignIn } = await auth(); 
    return redirectToSignIn();
  }

  return NextResponse.next();  
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // Matches everything except Next.js internals
    '/(api|trpc)(.*)', // Matches API routes (e.g., /api/breaches)
  ],
};
