"use server";
import { headers } from "next/headers";
import { auth } from "./auth";

const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
};

export default getCurrentUser;
