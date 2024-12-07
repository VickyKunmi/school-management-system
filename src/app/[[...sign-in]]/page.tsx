"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  // console.log(user)
  const router = useRouter();
  
  
  
  
  

  // useEffect(() => {
  //   // Make sure user is loaded before accessing role
  //   if (isLoaded && user) {
  //     const role = user.publicMetadata.role;
  //     console.log("role", role);
  //     console.log("role path", `/${role}`);

  //     if (role) {
  //       router.push(`/${role}`);
  //     }
  //   }
  // }, [isLoaded, user, router]);


  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata.role;
      console.log("role", role);
  
      if (role) {
        router.push(`/${role}`);
      } else {
        console.error("Role not defined for user!");
        router.push("/error"); // Redirect to a generic error or default page
      }
    }
  }, [isLoaded, user, router]);
  


  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-yellow">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  


  return (
    <div className="h-screen flex items-center justify-center bg-yellow">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/slogo.png" alt="" width={24} height={24} />
            GreatTess School
          </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <SignIn.Action
            submit
            className="bg-green-500 text-white my-1 rounded-md text-sm p-[10px]"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
      
    </div>
  );
};

export default LoginPage;




// "use client";

// import { useSignIn } from "@clerk/nextjs";
// import React from "react";

// const LoginPage = () => {
//   const { signIn, isLoaded } = useSignIn();

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Access form data
//     const form = e.currentTarget;
//     const username = form.username.value;
//     const password = form.password.value;

//     if (isLoaded) {
//       try {
//         await signIn.create({ identifier: username, password });
//         alert("Signed in successfully!");
//       } catch (error) {
//         console.error("Login failed", error);
//         alert("Login failed. Please check your credentials.");
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleLogin} className="p-4">
//       <input type="text" name="username" placeholder="Username" required />
//       <input type="password" name="password" placeholder="Password" required />
//       <button type="submit">Sign In</button>
//     </form>
//   );
// };

// export default LoginPage;
