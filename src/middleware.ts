// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { routeAccessMap } from "./lib/settings";
// import { NextResponse } from "next/server";


// const matchers = Object.keys(routeAccessMap).map((route) => ({
//     matcher: createRouteMatcher([route]),
//     allowedRoles: routeAccessMap[route],
// }));

// // console.log(matchers)


// export default clerkMiddleware(async(auth, req) => {
// //   if (isProtectedRoute(req)) await auth.protect()
// // const authObject = await auth();
//    const {sessionClaims} = auth();
//    console.log("Session Claims:", sessionClaims);
//    const role = (sessionClaims?.metadata as {role?: string})?.role;
//    for (const {matcher, allowedRoles} of matchers) {
//     if(matcher(req) && !allowedRoles.includes(role!)) {
//         return NextResponse.redirect(new URL(`/${role}`, req.url));
//     }
//    }

// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };






import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

// Define a type for the sessionClaims metadata
interface SessionClaimsMetadata {
  role?: string; // Define the role field
}

interface SessionClaims {
  metadata?: SessionClaimsMetadata;
}

interface AuthObject {
  sessionClaims: SessionClaims;
}

// Define route matchers and allowed roles
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  // Await the result of auth() to get the Auth object
  const authObject = await auth() as AuthObject; // Cast the result to AuthObject

  // Now you can safely access sessionClaims
  const sessionClaims = authObject.sessionClaims;

  // Extract role from sessionClaims
  const role = sessionClaims?.metadata?.role;

  // Loop through matchers and check if the role is allowed for the route
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      // Redirect to the role-specific page if not allowed
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
