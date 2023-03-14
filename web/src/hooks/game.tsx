import { getGameDoc, getPlayerRoom, userCollection } from "@/lib/firebase/references/firestore";
import { endAt, getDocs, limit, onSnapshot, orderBy, query, startAt } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Game, Room, uid } from "@/lib/firebase/firestore-types/game";

export type PreviewCompetitors = {
  userId: uid;
  nickname: string;
};

/**
 *
 * @param gameId
 * @param userId
 * @returns the game doc data and error
 */
export function useGame(gameId: string, userId?: uid): [Game | undefined, string] {
  const [gameData, setGameData] = useState<Game | undefined>();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (gameId === "") {
      return;
    }

    const gameDocRef = getGameDoc(gameId);

    const unsub = onSnapshot(
      gameDocRef,
      (doc) => {
        const data = doc.data();

        if (!doc.exists() || data === undefined) {
          setError("Game doesn't exist!");
          return;
        }

        const uids = Object.keys(data.playersPublic);
        if (userId !== undefined && !uids.includes(userId)) {
          router.replace(`/join?code=${gameId}`);
          return;
        }

        setGameData(data);
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsub();
  }, [gameId, router, userId]);

  return [gameData, error];
}

/**
 *
 * @param nickname
 * @returns a list of users that match the nickname param
 */
export function useFindCompetitors(nickname: string): PreviewCompetitors[] {
  const [users, setUsers] = useState<PreviewCompetitors[]>([]);
  useEffect(() => {
    if (nickname === "") {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      const q = query(userCollection, orderBy("nickname"), startAt(nickname), endAt(nickname + "\uf8ff"), limit(5));
      const userSnapshots = await getDocs(q);

      if (userSnapshots.empty) {
        return;
      }

      const usersData: PreviewCompetitors[] = userSnapshots.docs.map((userDoc) => {
        const { nickname } = userDoc.data();

        return { nickname, userId: userDoc.id };
      });

      setUsers(usersData);
    };

    searchUsers();
  }, [nickname]);

  return users;
}

export function usePlayerRoom(gameId: string, userId: uid) {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const roomDocRef = getPlayerRoom(gameId, userId);

    const unsub = onSnapshot(
      roomDocRef,
      (doc) => {
        const roomData = doc.data();

        if (roomData === undefined) {
          return;
        }

        setRoom(roomData);
      },
      (err) => console.error(err.message)
    );

    return () => unsub();
  }, [userId, gameId]);

  return room;
}
