import { usePlayerRoom } from "@/hooks/game";
import { Game as GameType, uid } from "@/lib/firebase/firestore-types/game";
import { generateOptions, shuffle } from "@/lib/helpers";
import { Loader } from "lucide-react";
import { useMemo } from "react";

type GameProps = {
  gameId: string;
  userId: uid;
  publicPlayers: GameType["playersPublic"];
};

export default function Game({ gameId, userId, publicPlayers }: GameProps) {
  const room = usePlayerRoom(gameId, userId);
  const options = useMemo(() => {
    if (room === undefined) {
      return;
    }

    return generateOptions(room.numOne, room.numTwo, room.operation);
  }, [room]);

  if (room === undefined || options === undefined) {
    return (
      <div className="grid h-5/6 place-items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1>Game State {room.operation}</h1>
      <div>
        <h1>{room.numOne}</h1>
        <h1>{room.numTwo}</h1>
      </div>
      <div className="pb-20"></div>
      {shuffle(options.options).map((a, idx) => {
        return <p key={idx}>{a}</p>;
      })}
    </div>
  );
}
