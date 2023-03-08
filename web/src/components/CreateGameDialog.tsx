import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/Select";
import { Button } from "./ui/Button";
import { DialogHeader, DialogFooter, Dialog, DialogTitle, DialogContent, DialogDescription } from "./ui/Dialog";
import { useState } from "react";
import { Topics, Game } from "@/lib/firebase/firestore-types/game";
import { isCapacity, isTopic } from "@/lib/firebase/firestore-types/validations";
import { createGame } from "@/lib/firebase/references/functions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { FirebaseError } from "firebase/app";

type CreateGameDialogProps = {
  userId: string;
  open: boolean;
  onClose: () => void;
};

export default function CreateGameModal(props: CreateGameDialogProps) {
  const [topic, setTopic] = useState<Topics>("MATH");
  const [capacity, setCapacity] = useState<Game["capacity"]>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const createGameHandler = async () => {
    setLoading(true);

    try {
      const { data } = await createGame({ topic, capacity });
      router.replace(`/games/${data.gameId}`);
      props.onClose();
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
    <Dialog open={props.open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Set Game Settings</DialogTitle>
          <DialogDescription className="text-center">Set how the game should play.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-y-2 md:flex-row gap-x-2">
          <Select
            onValueChange={(value) => {
              if (!isTopic(value)) {
                return;
              }

              setTopic(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="math">Math</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              const valueAsNumber = Number(value);
              if (isNaN(valueAsNumber) || !isCapacity(valueAsNumber)) {
                return;
              }

              setCapacity(valueAsNumber);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent>
              {Array.from([1, 2, 3, 4, 5, 6]).map((item, idx) => {
                return (
                  <SelectItem key={idx} value={item.toString()}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter style={{ justifyContent: "center", margin: "auto" }} className="flex-row gap-2 ">
          {!loading && (
            <Button variant="default" type="button" onClick={() => props.onClose()}>
              Cancel
            </Button>
          )}

          <Button variant="default" type="button" disabled={error !== ""} onClick={createGameHandler}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
