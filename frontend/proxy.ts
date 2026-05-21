import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/shopkeeper/dashboard(.*)",
  "/shopkeeper/products(.*)",
  "/shopkeeper/orders(.*)",
  "/shopkeeper/analytics(.*)",
  "/admin(.*)",
  "/profile(.*)",
  "/api/lock-offer(.*)",
  "/api/seed(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
