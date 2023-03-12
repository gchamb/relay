import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Check, Copy, Share } from "lucide-react";

type StatefulButtonProps = {
  className?: string;
  icon: "share" | "copy";
  action: () => Promise<void> | undefined;
};

export default function StatefulButton({ icon, action, className }: StatefulButtonProps) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (clicked) {
      timer = setTimeout(() => setClicked(false), 2000);
    }

    () => clearTimeout(timer);
  }, [clicked]);

  return (
    <Button
      className={className}
      variant="ghost"
      onClick={async () => {
        if (clicked) {
          return;
        }

        let returnType: ReturnType<typeof action>;
        if (returnType === undefined) {
          action();
        } else {
          await action();
        }

        setClicked(true);
      }}
    >
      {!clicked ? (
        <>
          {icon === "copy" && (
            <>
              <Copy />
              <span className="sr-only">Copy Join Link</span>
            </>
          )}
          {icon === "share" && (
            <>
              <Share />
              <span className="sr-only">Share Join Link</span>
            </>
          )}
        </>
      ) : (
        <Check />
      )}
    </Button>
  );
}
