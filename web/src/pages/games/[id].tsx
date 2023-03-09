import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";

import { useGame, useUser } from "@/hooks/firebase";
import { properCase } from "@/lib/helpers";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Game() {
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
    <div className="grid gap-y-10 h-full md:h-5/6 gap-y-0">
      <div className="self-center flex flex-col gap-y-2 text-center text-2xl">
        <h1>
          Topic is <span className="font-bold">{properCase(game.topic)}</span>
        </h1>
        <h1>
          {Object.keys(game.playersPublic).length}/{game.capacity} Players
        </h1>
        {game.playersPublic[user.uid].host && (
          <Button variant="outline" className="self-center">
            Start Game
          </Button>
        )}
      </div>
      <div className="w-5/6 m-auto flex flex-wrap gap-3 justify-center">
        {Object.entries(game.playersPublic).map(([uid, player], idx) => {
          return (
            <div className="flex flex-col text-center gap-y-2" key={idx}>
              <img
                className="w-32 rounded-full md:w-52"
                src={player.profilePic}
                alt={player.nickname}
              />
              <span className={`${uid === user.uid && "text-red-400"}`}>{player.nickname}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
