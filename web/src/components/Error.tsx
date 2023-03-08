import { useRouter } from "next/router";
import { Button } from "./ui/Button";

type ErrorProps = {   
    error: string;
    className?:string;
    returnLink?:string;
    returnMessage?:string;
}

export default function Error(props: ErrorProps){
    const router = useRouter();
    return <div className={props.className}>
        <h1 className="font-semibold text-3xl  text-red-700">{props.error}</h1>
        <Button onClick={() => router.replace(props.returnLink ?? "/home")}>
            {props.returnMessage ?? "Return to Home"}
        </Button>
    </div>
}