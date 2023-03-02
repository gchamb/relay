import { Button } from "./ui/Button";
import { DialogHeader, DialogFooter, DialogDescription, Dialog, DialogTitle, DialogContent } from "./ui/Dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/Input";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { fileValidator, usernameValidator } from "@/lib/firebase/firestore-types/validations";
import { createUserDoc, deleteUserDoc } from "@/lib/firebase/users";
import { FirebaseError } from "firebase/app";
import { getProfilePicRef } from "@/lib/firebase/references/storage";
import { uploadBytes } from "firebase/storage";

type WalkthroughDialogProps = {
  userId: string;
  onClose: () => void;
  open: boolean;
};

export default function WalkthroughDialog(props: WalkthroughDialogProps) {
  const [slide, setSlide] = useState<1 | 2>(1);
  const [nickname, setNickName] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [validationError, setValidationError] = useState("");

  let { current } = useRef<HTMLInputElement | null>(null);

  const slideHandler = async () => {
    if (slide === 2) {
      if (profilePic === null) {
        setValidationError("You must add a profile pic");
        return;
      }

      // create their user doc with the nickname and zeros for stats
      try {
        await createUserDoc(props.userId, nickname.trim());
      } catch (err) {
        if (err instanceof FirebaseError) {
          setValidationError(err.message);
        } else {
          setValidationError(String(err));
        }

        return;
      }

      // add their profile pic to the bucket
      let fileUploadSuccess = false;
      try {
        await uploadBytes(getProfilePicRef(props.userId), profilePic);
        fileUploadSuccess = true;
      } catch (err) {
        if (err instanceof FirebaseError) {
          setValidationError(err.message);
        } else {
          setValidationError(String(err));
        }
      }

      // if the file upload failed then delete their user doc to try again
      if (!fileUploadSuccess) {
        try {
          // if successful then the user should be able to alter their choices and submit
          await deleteUserDoc(props.userId);
          return;
        } catch (err) {
          // the very worst case senario
          // the user doc would be created but have no profile pic in which we would need a fallback
          props.onClose();
        }
      }

      // close the modal
      props.onClose();
    } else {
      setSlide(2);
    }
  };

  return (
    <Dialog open={props.open}>
      <DialogContent className="sm:max-w-[425px]">
        {slide === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to Relay!</DialogTitle>
              <DialogDescription>{"We're happy to see you trying out our game."}</DialogDescription>
            </DialogHeader>
            <p>Before you get started, we need you to finish creating your account!</p>
          </>
        )}

        {slide === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Profile Picture & Nickname</DialogTitle>
              <DialogDescription className="text-center">
                To identify yourself and others in game this is needed.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-y-2">
              {validationError !== "" && <p className="text-red-700 font-semibold text-center">{validationError}</p>}
              <div className="flex flex-col w-2/3 m-auto text-center gap-y-2">
                <Label>Nickname</Label>
                <Input
                  className="text-center"
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    const { value } = e.target;
                    setNickName(value);

                    // validate
                    const valid = usernameValidator(value);

                    if (!valid.valid) {
                      setValidationError(valid.reason);
                    } else {
                      if (validationError !== "") {
                        setValidationError("");
                      }
                    }
                  }}
                />
              </div>

              <div className="self-center flex flex-col items-center gap-y-2 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (current == null) {
                      return;
                    }

                    current.click();
                  }}
                >
                  Upload
                </Button>

                <span className="text-sm text-slate-500 dark:text-slate-400 text-center">5 MB Upload Limit</span>
                <input
                  className="hidden"
                  ref={(ref) => {
                    if (ref == null) {
                      return;
                    }

                    current = ref;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const { files } = e.target;

                    if (files === null || files.length === 0) {
                      return;
                    }

                    const file = files[0];
                    const valid = fileValidator(file);

                    if (!valid.valid) {
                      setValidationError(valid.reason);
                    } else {
                      if (validationError !== "") {
                        setValidationError("");
                      }
                    }

                    setProfilePic(file);
                  }}
                />

                {profilePic !== null && (
                  <img
                    className="w-1/2 square rounded-full object-cover"
                    src={URL.createObjectURL(profilePic)}
                    alt={profilePic.name}
                  />
                )}
              </div>
            </div>
          </>
        )}

        <DialogFooter style={{ justifyContent: slide == 1 ? "flex-end" : "center" }}>
          {slide == 1 && (
            <Button className="ml-auto" variant="ghost" type="button" onClick={slideHandler}>
              <ArrowRight />
            </Button>
          )}
          {slide == 2 && nickname !== "" && profilePic !== null && (
            <Button disabled={validationError !== ""} variant="default" type="button" onClick={slideHandler}>
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
