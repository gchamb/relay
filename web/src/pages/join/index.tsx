import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUser } from "@/hooks/user";
import { joinGame } from "@/lib/firebase/references/functions";
import { getUserDoc } from "@/lib/firebase/users";
import { FirebaseError } from "firebase/app";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Join() {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { code: queryCode } = router.query;
    if (queryCode !== undefined && typeof queryCode === "string") {
      setCode(queryCode);
    }

    const fetchUserDoc = async () => {
      if (user !== null) {
        try {
          const { userDoc } = await getUserDoc(user.uid);
          if (!userDoc.exists()) {
            router.replace("/home");
            return;
          }
        } catch (err) {
          router.replace("/home");
        }
      }
    };

    fetchUserDoc();
  }, [router, user]);

  const joinGameHandler: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if (code === "") {
      setError("Code can't be empty!");
      return;
    }

    setLoading(true);

    try {
      await joinGame({ gameId: code });
      router.push(`/games/${code}`);
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
    <div className="h-5/6 m-auto text-center grid grid-rows-2">
      <h1 className="self-center text-3xl">
        Join A <span className="font-bold">Relay</span> Game!
      </h1>
      <form className="self-start w-50 mx-auto grid gap-y-2 justify-items-center md:w-80" onSubmit={joinGameHandler}>
        {error !== "" && <p className="text-red-700 font-semibold">{error}</p>}
        <Input className="text-center font-semibold text-xl" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button size="xxl" type="submit">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Join
        </Button>
      </form>
    </div>
  );
}
