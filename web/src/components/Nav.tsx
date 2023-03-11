import Link from "next/link";
import InviteInbox from "./InviteInbox";
import Account from "./Account";

import { useUser } from "@/hooks/user";
import { useRouter } from "next/router";
import { Home } from "lucide-react";


export default function Nav() {
  const user = useUser();
  const { pathname } = useRouter();

  if (user == null) {
    return <></>;
  }

  return (
    <nav className="w-11/12 flex items-center m-auto pt-3">
      {pathname === "/" ? (
        <Link className="ml-auto" href="/home">
          <Home />
        </Link>
      ) : (
        <>
          <Link href="/home">
            <span className="text-2xl font-semibold cursor-pointer text-slate-900 hover:text-slate-700  dark:text-white">
              Relay
            </span>
          </Link>

          <div className="w-24 flex items-center justify-between ml-auto">
            <InviteInbox />
            <Account />
          </div>
        </>
      )}
    </nav>
  );
}
