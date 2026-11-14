import { IconDotsVertical, IconFlag, IconBan } from "@tabler/icons-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const REPORT_REASONS = ["Spam or scam", "Abusive or offensive messages", "Inappropriate content", "Other"];

interface ChatSafetyMenuProps {
  name: string;
  onReport: (reason: string) => void;
  onBlock: () => void;
}

export default function ChatSafetyMenu({ name, onReport, onBlock }: ChatSafetyMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Report or block this user" className="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground active:bg-muted hover:bg-muted transition-colors shrink-0">
          <IconDotsVertical size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2"><IconFlag size={16} /> Report {name}</DropdownMenuLabel>
        {REPORT_REASONS.map((reason) => (
          <DropdownMenuItem key={reason} onSelect={() => onReport(reason)}>{reason}</DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            if (window.confirm(`Block ${name}? You will no longer see their messages or listings.`)) onBlock();
          }}
        >
          <IconBan size={16} className="mr-2" /> Block {name}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
