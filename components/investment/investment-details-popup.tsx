import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InvestmentDetailsPopupProps {
  onClose: () => void;
}

export default function InvestmentDetailsPopup({ onClose }: InvestmentDetailsPopupProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Investment Details</DialogTitle>
          <DialogDescription>
            Here are the details of the selected investment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Investment Name</h3>
            <p className="text-sm text-muted-foreground">
              Apple Inc. (AAPL)
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Type</h3>
            <p className="text-sm text-muted-foreground">
              Stock
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Amount Invested</h3>
            <p className="text-sm text-muted-foreground">
              $5,000.00
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Current Value</h3>
            <p className="text-sm text-muted-foreground">
              $6,250.00
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Gain/Loss</h3>
            <p className="text-sm text-green-500">
              +$1,250.00 (+25%)
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