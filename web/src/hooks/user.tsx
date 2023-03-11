import { auth } from "@/lib/firebase/app";
import { User } from "firebase/auth";
import { useEffect, useState, createContext, ReactNode, FC, useContext } from "react";
import { useRouter } from "next/router";

const userContext = createContext<User | null>(null);

/**
 *
 * @returns the current state of the user
 *
 */
export function UserProvider(props: { children: ReactNode }) {
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

  return <userContext.Provider value={user}>{props.children}</userContext.Provider>;
}

export function useUser() {
  return useContext(userContext);
}
