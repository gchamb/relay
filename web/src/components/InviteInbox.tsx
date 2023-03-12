import MyPopover from "./MyPopover";
import MyToolTip from "./MyTooltip";
import Loader from "./Loader";

import { Check, Inbox, Trash2 } from "lucide-react";
import { useSubscribeInvites } from "@/hooks/user";
import { Separator } from "./ui/Separator";
import { useMemo, useState } from "react";
import { deleteInvite, joinGame } from "@/lib/firebase/references/functions";
import { useRouter } from "next/router";
import { FirebaseError } from "firebase/app";
import { Invite } from "@/lib/firebase/firestore-types/users";

export default function InviteInbox() {
  const [readInvites, setReadInvites] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const invites = useSubscribeInvites();
  const router = useRouter();
  const unRead = useMemo(() => {
    if (invites.length - readInvites < 0) {
      setReadInvites(invites.length);
      return 0;
    }

    return invites.length - readInvites;
  }, [invites, readInvites]);

  const joinGameHandler = async (gameId: string) => {
    setLoading(true);

    try {
      await joinGame({ gameId });
      router.push(`/games/${gameId}`);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteInviteHandler = async (invite: Invite) => {
    setLoading(true);

    try {
      await deleteInvite(invite);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyPopover
      align="end"
      slotTrigger={
        <button
          className="relative p-1"
          onClick={() => {
            if (readInvites === invites.length) {
              return;
            }

            setReadInvites(invites.length);
          }}
        >
          <Inbox className="cursor-pointer" />
          <span className="sr-only">Invites</span>
          {unRead > 0 && (
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
              {unRead}
            </div>
          )}
        </button>
      }
      contentClassName="w-60"
      beforeClosing={() => {
        setError("");
      }}
      slotContent={
        <>
          {loading ? (
            <Loader size={10} />
          ) : (
            <>
              {invites.length !== 0 ? (
                <div className="flex flex-col gap-y-2">
                  <h2 className="font-semibold text-center text-md pb-1">Invites</h2>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    {error !== "" && <span className="text-sm text-center text-red-700 font-semibold">{error}</span>}
                    {invites.map((invite, idx) => {
                      return (
                        <div className="flex justify-between items-center" key={idx}>
                          <div className="flex flex-col ">
                            <span>{invite.host}</span>
                            <span className="opacity-40 text-sm">{invite.sentAt.toDate().toDateString()}</span>
                            <span className="opacity-40 text-sm">{invite.sentAt.toDate().toLocaleTimeString()}</span>
                          </div>

                          <MyToolTip
                            slotTrigger={
                              <>
                                <Check
                                  className="w-5 cursor-pointer hover:text-green-500 focus:text-green-500"
                                  onClick={async () => await joinGameHandler(invite.gameId)}
                                />
                                <span className="sr-only">Accept</span>
                              </>
                            }
                            slotContent={<span>Accept</span>}
                          />
                          <MyToolTip
                            slotTrigger={
                              <>
                                <Trash2
                                  className="w-5 cursor-pointer hover:text-red-500 focus:text-red-500"
                                  onClick={async () => await deleteInviteHandler(invite)}
                                />
                                <span className="sr-only">Delete</span>
                              </>
                            }
                            slotContent={<span>Delete</span>}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <h2 className="font-semibold text-center text-md">No Invites!</h2>
              )}
            </>
          )}
        </>
      }
    />
  );
}
