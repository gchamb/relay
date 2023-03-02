import Loader from "@/components/Loader";
import WalkthroughDialog from "@/components/WalkthroughDialog";

import { useUser } from "@/hooks/firebase";
import { getUserDoc } from "@/lib/firebase/users";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";

export default function Home() {
  const user = useUser();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // fetching the current user doc
    // to check whether they have seen the walk through modal at all
    const fetchUserDoc = async () => {
      if (user !== null) {
        try {
          const { userDoc } = await getUserDoc(user.uid);
          if (!userDoc.exists()) {
            setOpenModal(true);
            return;
          }
        } catch (err) {
          if (err instanceof FirebaseError) {
            console.error(err.message);
          }
        }
      }
    };

    fetchUserDoc();
  }, [user]);

  if (user == null) {
    return <Loader />;
  }

  return (
    <div>
      {/* Check if we should show the modal  */}
      <WalkthroughDialog open={openModal} userId={user.uid} onClose={() => setOpenModal(false)} />
      {/* Create/Join Games */}
      {/* <button>Signout</button> */}
      <h1>Game Creation Stuff</h1>
    </div>
  );
}
