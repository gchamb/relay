import { PopoverTrigger, Popover, PopoverContent } from "./ui/Popover";

type MyPopoverProps = {
  slotTrigger: React.ReactNode;
  slotContent: React.ReactNode;
  beforeClosing?: () => void;
  contentClassName?: string;
  align?: "start" | "end" | "center";
};

export default function MyPopover(props: MyPopoverProps) {
  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          props.beforeClosing?.();
        }
      }}
    >
      <PopoverTrigger asChild>{props.slotTrigger}</PopoverTrigger>
      <PopoverContent align={props.align} className={props.contentClassName}>
        {props.slotContent}
      </PopoverContent>
    </Popover>
  );
}
