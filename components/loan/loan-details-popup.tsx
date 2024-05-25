import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoanDetailsPopupProps {
  onClose: () => void;
}

export default function LoanDetailsPopup({ onClose }: LoanDetailsPopupProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Loan Details</DialogTitle>
          <DialogDescription>
            Here are the details of the selected loan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Loan Name</h3>
            <p className="text-sm text-muted-foreground">
              Personal Loan
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Type</h3>
            <p className="text-sm text-muted-foreground">
              Unsecured
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Loan Amount</h3>
            <p className="text-sm text-muted-foreground">
              $10,000.00
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Interest Rate</h3>
            <p className="text-sm text-muted-foreground">
              5.99%
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Loan Term</h3>
            <p className="text-sm text-muted-foreground">
              36 months
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Monthly Payment</h3>
            <p className="text-sm text-muted-foreground">
              $299.00
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Total Interest</h3>
            <p className="text-sm text-muted-foreground">
              $776.40
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Total Amount Payable</h3>
            <p className="text-sm text-muted-foreground">
              $10,776.40
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}