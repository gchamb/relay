import Loader from "@/components/Loader";

import { useGame } from "@/hooks/firebase";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Game() {
  const router = useRouter();
  const gameId = useMemo(() => {
    if (typeof router.query.id !== "string") {
      return;
    }

    return router.query.id;
  }, [router]);

  const game = useGame(gameId ?? "");

  if (game === undefined) {
    return (
      <div className="grid h-5/6 place-items-center">
        <Loader />
      </div>
    );
  }

  return <h1>Hi {game.topic}</h1>;
}
