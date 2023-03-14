import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Lobby from "@/components/Lobby";

import { useUser } from "@/hooks/user";
import { useGame } from "@/hooks/game";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Game from "@/components/Game";

export default function Relay() {
  // hooks
  const user = useUser();
  const router = useRouter();
  const gameId = useMemo(() => {
    if (typeof router.query.id !== "string") {
      return "";
    }

    return router.query.id;
  }, [router]);
  const [game, error] = useGame(gameId, user?.uid);

  if (error !== "") {
    return <Error className="flex flex-col gap-y-2 h-5/6 items-center justify-center" error={error} />;
  }

  if (game === undefined || user == null) {
    return (
      <div className="grid h-5/6 place-items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {game.state === "WAIT" && <Lobby game={game} gameId={gameId} user={user} />}
      {game.state === "GAME" && <Game userId={user.uid} gameId={gameId} publicPlayers={game.playersPublic} />}
    </>
  );
}
