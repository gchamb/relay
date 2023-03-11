import Error from "@/components/Error";
import Loader from "@/components/Loader";
import MyPopover from "@/components/MyPopover";
import StatefulButton from "@/components/StatefulButton";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUser } from "@/hooks/user";
import { useFindCompetitors, useGame } from "@/hooks/game";
import { properCase } from "@/lib/helpers";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/Separator";
import { invitePlayer } from "@/lib/firebase/references/functions";
import { uid } from "@/lib/firebase/firestore-types/game";
import { FirebaseError } from "firebase/app";

export default function Game() {
  // state
  const [sharable, setShareable] = useState(false);
  const [searchCompetitors, setSearchCompetitors] = useState("");
  const [inviteStatus, setInviteStatus] = useState<{ loading: boolean; valid?: boolean; message: string }>({
    loading: false,
    valid: undefined,
    message: "",
  });
  // hooks
  const user = useUser();
  const router = useRouter();
  const gameId = useMemo(() => {
    if (typeof router.query.id !== "string") {
      return "";
    }

    return router.query.id;
  }, [router]);

  const shareLink = useMemo(() => {
    if (typeof window === "undefined") {
      return;
    }

    const host = window.location.origin;

    return `${host}/join?code=${gameId}`;
  }, [gameId]);
  const competitors = useFindCompetitors(searchCompetitors);
  const [game, error] = useGame(gameId, user?.uid);

  useEffect(() => {
    const shareableData = {
      title: "Relay!",
      text: "Put your mind to the test! Join up.",
      url: shareLink,
    };
    setShareable(navigator.canShare?.(shareableData));
  }, [shareLink]);

  // functions
  const copyJoinLink = async () => {
    await navigator.clipboard.writeText(shareLink ?? "").catch((err) => console.error(err));
  };

  const shareUrl = async () => {
    const shareableData = {
      title: "Relay!",
      text: "Put your mind to the test! Join up.",
      url: shareLink,
    };

    await navigator.share(shareableData).catch((err) => console.error(err));
  };

  const invitePlayerHandler = async (invitee: uid) => {
    setInviteStatus((prev) => {
      return { ...prev, loading: true };
    });

    try {
      await invitePlayer({ gameId, invitee });
      setInviteStatus({ valid: true, message: "Successfully Invited!", loading: false });
    } catch (err) {
      if (err instanceof FirebaseError) {
        setInviteStatus({ valid: false, message: err.message, loading: false });
      } else {
        setInviteStatus({ valid: false, message: String(err), loading: false });
      }
    }
  };

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
              <img className="w-32 rounded-full md:w-52" src={player.profilePic} alt={player.nickname} />
              <span className={`${uid === user.uid && "text-red-400 font-semibold"}`}>{player.nickname}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-x-2">
        <StatefulButton icon="copy" action={copyJoinLink} />
        {game.playersPublic[user.uid].host && game.inviteOnly && (
          <MyPopover
            beforeClosing={() => {
              setSearchCompetitors("");
              setInviteStatus({ valid: undefined, message: "", loading: false });
            }}
            slotTrigger={
              <Button variant="ghost">
                <Plus />
                <span className="sr-only">Add Competitors</span>
              </Button>
            }
            slotContent={
              <div className="flex flex-col text-center gap-y-2">
                <h2 className="font-semibold">Add Competitors</h2>
                {inviteStatus.valid ? (
                  <p className="text-green-500">{inviteStatus.message}</p>
                ) : (
                  <p className="text-red-700">{inviteStatus.message}</p>
                )}
                <Input
                  className="text-center"
                  value={searchCompetitors}
                  onChange={(e) => setSearchCompetitors(e.target.value)}
                />
                {competitors.length !== 0 && (
                  <div className="grid gap-y-2 p-2 rounded-md">
                    {competitors.map(({ nickname, userId }, idx) => {
                      return (
                        <>
                          <div className="flex justify-between items-center" key={idx}>
                            <span className="text-lg">{nickname}</span>
                            <span>#{userId.substring(userId.length - 4, userId.length)}</span>
                            <Button
                              variant="outline"
                              className="w-10 p-0 rounded-full"
                              onClick={async () => await invitePlayerHandler(userId)}
                              disabled={inviteStatus.loading}
                            >
                              <Plus />
                            </Button>
                          </div>
                          <Separator />
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            }
          />
        )}

        {sharable && <StatefulButton icon="share" action={shareUrl} />}
      </div>
    </div>
  );
}
