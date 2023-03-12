import { auth } from "@/lib/firebase/app";
import { User as FirebaseUser } from "firebase/auth";
import { useEffect, useState, createContext, ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import { Invite } from "@/lib/firebase/firestore-types/users";
import { doc, onSnapshot } from "firebase/firestore";
import { userCollection } from "@/lib/firebase/references/firestore";

const userContext = createContext<FirebaseUser | null>(null);

/**
 *
 * @returns the context provider for this be used throughout the entire application
 *
 */
export function UserProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
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

/**
 *
 * @returns the current state of the user using the context provider
 */
export function useUser() {
  return useContext(userContext);
}

/**
 *
 * @returns the invites the user has received
 * @note it is subscribe so it's realtime updates
 */
export function useSubscribeInvites() {
  const user = useUser();
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    if (user == null) {
      return;
    }

    const userDocRef = doc(userCollection, user.uid);
    const unsub = onSnapshot(
      userDocRef,
      (doc) => {
        const userData = doc.data();
        if (userData === undefined) {
          return;
        }

        setInvites(userData.invites);
      },
      (err) => {
        console.error(err);
        console.log("ERROR IOS HERE");
      }
    );

    return () => unsub();
  }, [user]);

  return invites;
}
