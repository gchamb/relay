import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Button } from "./ui/Button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/Input";

type EmailDialogProps = {
  onClick: (email: string, password: string, option: "Sign In" | "Sign Up") => void;
  error?: string;
  resetError: () => void;
};

export default function EmailDialog(props: EmailDialogProps) {
  const [option, setOption] = useState<"Sign In" | "Sign Up">("Sign In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState({ email: "", password: "" });

  const optionClickHandler = (type: typeof option) => {
    setOption(type);
  };

  const emailOnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setEmail(value);

    // shows validation error if empty
    // removes validation error not empty there was a message there previously
    if (value === "") {
      setValidationError((prev) => {
        return { ...prev, email: "You must enter an email" };
      });
    } else {
      if (validationError.email) {
        setValidationError((prev) => {
          return { ...prev, email: "" };
        });
      }
    }
  };

  const passwordOnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setPassword(value);
    
    // shows validation error if empty
    // removes validation error not empty there was a message there previously
    if (value.trim() === "") {
      setValidationError((prev) => {
        return { ...prev, password: "You must enter a password" };
      });
      return;
    } else {
      if (validationError.password) {
        setValidationError((prev) => {
          return { ...prev, password: "" };
        });
      }
    }

    if (value.trim().length < 6) {
      setValidationError((prev) => {
        return { ...prev, password: "Password must be at least 6 characters" };
      });
    } else {
      if (validationError.password) {
        setValidationError((prev) => {
          return { ...prev, password: "" };
        });
      }
    }
  };

  const resetStates = () => {
    setEmail("");
    setPassword("");
    setOption("Sign In");
    setValidationError({ email: "", password: "" });
    props.resetError();
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          resetStates();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Sign in with Email</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <Label
              className={`cursor-pointer ${option !== "Sign In" ? "text-slate-600" : ""}`}
              onClick={() => optionClickHandler("Sign In")}
            >
              Sign In
            </Label>
            <span>/</span>
            <Label
              className={`cursor-pointer ${option !== "Sign Up" ? "text-slate-600" : ""}`}
              onClick={() => optionClickHandler("Sign Up")}
            >
              Sign Up
            </Label>
          </DialogTitle>
        </DialogHeader>

        {props.error !== undefined && (
          <span className="text-center text-red-700 font-bold dark:text-red-800">{props.error}</span>
        )}

        <div className="grid grid-rows-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" onChange={emailOnChangeHandler} value={email} />
            {validationError.email !== "" && (
              <p className="text-red-700 font-semibold dark:text-red-800">{validationError.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={passwordOnChangeHandler} value={password} />
            {validationError.password !== "" && (
              <p className="text-red-700 font-semibold dark:text-red-800">{validationError.password}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              if (email.trim() === "") {
                setValidationError((prev) => {
                  return { ...prev, email: "You must enter an email" };
                });
              }

              if (password.trim() === "") {
                setValidationError((prev) => {
                  return { ...prev, password: "You must enter a password" };
                });
              }

              if (password.trim() === "" || password.trim() === "") {
                return;
              }

              props.onClick(email.trim(), password.trim(), option);
            }}
          >
            {option}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
