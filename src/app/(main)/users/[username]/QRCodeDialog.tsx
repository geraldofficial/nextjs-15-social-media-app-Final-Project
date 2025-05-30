import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QRCodeDialogProps {
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QRCodeDialog({ username, open, onOpenChange }: QRCodeDialogProps) {
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/users/${username}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 p-4">
          <QRCodeSVG
            value={profileUrl}
            size={200}
            className="rounded-lg border bg-white p-2"
          />
          <div className="text-center text-muted-foreground">
            Scan to visit @{username}&apos;s profile
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
