import Loader from "@/components/Loader";
import WalkthroughDialog from "@/components/WalkthroughDialog";
import CreateGameModal from "@/components/CreateGameDialog";

import { useUser } from "@/hooks/firebase";
import { getUserDoc } from "@/lib/firebase/users";
import { FirebaseError } from "firebase/app";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/firebase/firestore-types/users";
import { properCase } from "@/lib/helpers";

export default function Home() {
  const user = useUser();
  const [userDoc, setUserDoc] = useState<User | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // fetching the current user doc
  // to check whether they have seen the walk through modal at all
  const fetchUserDoc = useCallback(async () => {
    if (user !== null) {
      try {
        const { userDoc } = await getUserDoc(user.uid);
        if (!userDoc.exists()) {
          setOpenModal(true);
          return;
        }

        setUserDoc(userDoc.data());
      } catch (err) {
        if (err instanceof FirebaseError) {
          console.error(err.message);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserDoc();
  }, [fetchUserDoc]);

  if (user == null) {
    return <Loader />;
  }

  return (
    <div className="h-5/6 grid ">
      {/* Check if we should show the modal  */}
      <WalkthroughDialog
        open={openModal}
        userId={user.uid}
        onClose={async () => {
          setOpenModal(false);
          await fetchUserDoc();
        }}
      />
      <CreateGameModal
        open={openCreateModal}
        userId={user.uid}
        onClose={() => {
          setOpenCreateModal(false);
        }}
      />

      {userDoc !== undefined && (
        <h1 className="self-center text-center text-2xl">Welcome {properCase(userDoc.nickname)}</h1>
      )}

      {/* Create/Join Games */}
      <div className="justify-self-center self-center flex flex-col justify-evenly gap-5 md:flex-row lg:flex-row">
        <Button size="xxl" disabled={userDoc === undefined} onClick={() => setOpenCreateModal(true)}>
          Create Game
        </Button>
        <Button size="xxl" disabled={userDoc === undefined}>
          Join Game
        </Button>
      </div>
    </div>
  );
}
