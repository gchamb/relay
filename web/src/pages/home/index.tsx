import Loader from "@/components/Loader";
import WalkthroughDialog from "@/components/WalkthroughDialog";
import CreateGameModal from "@/components/CreateGameDialog";
import Head from "next/head";

import { useUser } from "@/hooks/user";
import { getUserDoc } from "@/lib/firebase/users";
import { FirebaseError } from "firebase/app";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/firebase/firestore-types/users";
import { properCase } from "@/lib/helpers";
import { useRouter } from "next/router";

export default function Home() {
  const user = useUser();
  const router = useRouter();
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
      <Head>
        <title>Home</title>
      </Head>
      {/* Check if we should show the modal  */}
      <WalkthroughDialog
        open={openModal}
        userId={user.uid}
        onClose={async () => {
          setOpenModal(false);
          await fetchUserDoc();
        }}
      />
      <CreateGameModal open={openCreateModal} userId={user.uid} onClose={() => setOpenCreateModal(false)} />

      {userDoc !== undefined && (
        <h1 className="self-center text-center text-2xl">Welcome {properCase(userDoc.nickname)}</h1>
      )}

      {/* Create/Join Games */}
      <div className="justify-self-center self-center flex flex-col justify-evenly gap-5 md:flex-row lg:flex-row">
        <Button size="xxl" disabled={userDoc === undefined} onClick={() => setOpenCreateModal(true)}>
          Create Game
        </Button>
        <Button size="xxl" disabled={userDoc === undefined} onClick={() => router.push("/join")}>
          Join Game
        </Button>
      </div>
    </div>
  );
}
