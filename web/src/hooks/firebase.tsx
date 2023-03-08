import { auth } from "@/lib/firebase/app";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gamesCollection } from "@/lib/firebase/references/firestore";
import { onSnapshot, doc } from "firebase/firestore";
import { Game } from "../../../functions/src/firestore-types/game";

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

export function useGame(gameId: string, userId?: string): [Game | undefined, string] {
  const [gameData, setGameData] = useState<Game | undefined>();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (gameId === "") {
      return;
    }

    const gameDocRef = doc(gamesCollection, gameId);

    const unsub = onSnapshot(gameDocRef, (doc) => {
      const data = doc.data();

      if (!doc.exists() || data === undefined) {
        setError("Game doesn't exist!");
        return;
      }

      const uids = Object.keys(data.playersPublic);
      if (userId !== undefined && !uids.includes(userId)) {
        router.replace("/home");
        return;
      }

      setGameData(data);
    });

    return () => unsub();
  }, [gameId, router, userId]);

  return [gameData, error];
}
