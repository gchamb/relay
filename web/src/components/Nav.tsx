import Link from "next/link";

import { useUser } from "@/hooks/user";
import { Button } from "./ui/Button";
import { onSignOut } from "@/lib/firebase/auth";
import { useRouter } from "next/router";

export default function Nav() {
  const user = useUser();
  const { pathname } = useRouter();

  if (user == null) {
    return <></>;
  }

  return (
    <nav className="w-11/12 flex items-center m-auto">
      {pathname === "/" ? (
        <Link className="ml-auto" href="/home">
          <Button variant="link">Home</Button>
        </Link>
      ) : (
        <>
          <Link href="/home">
            <span className="text-2xl font-semibold cursor-pointer text-slate-900 hover:text-slate-700  dark:text-white">
              Relay
            </span>
          </Link>

          <Button className="ml-auto" variant="link" onClick={async () => await onSignOut()}>
            Logout
          </Button>
        </>
      )}
    </nav>
  );
}
