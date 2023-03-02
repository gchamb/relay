import { auth } from "@/lib/firebase/app";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 *
 * @returns the current state of the user
 *
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user == null && router.pathname !== "/") {
        router.replace("/");
        return;
      }

      setUser(user);
    });

    return () => unsub();
  }, [router]);

  return user;
}
