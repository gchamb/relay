import { PopoverTrigger, Popover, PopoverContent } from "./ui/Popover";

type MyPopoverProps = {
  slotTrigger: React.ReactNode;
  slotContent: React.ReactNode;
  beforeClosing?: () => void;
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
      <PopoverContent>{props.slotContent}</PopoverContent>
    </Popover>
  );
}
