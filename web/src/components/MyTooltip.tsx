import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

type MyToolTipProps = {
  slotTrigger: React.ReactNode;
  slotContent: React.ReactNode;
  contentClassName?: string;
  align?: "start" | "end" | "center";
};

export default function MyToolTip(props: MyToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{props.slotTrigger}</TooltipTrigger>
        <TooltipContent align={props.align} className={props.contentClassName}>
          {props.slotContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
