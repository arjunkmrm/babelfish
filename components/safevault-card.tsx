"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SetStateAction, useState } from "react";
import Image from "next/image";

const AddMoneyToSafevault = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleAmountChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Perform the transaction logic here
    // Display a confirmation message or handle errors
    setIsLoading(false);
    setShowDialog(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Money to Safevault</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Image
            src="/safevault.svg"
            alt="Safevault"
            width={120}
            height={120}
            className="rounded-full"
          />
          <div className="flex-1 space-y-4">
            <Input
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? "Adding Money..." : "Add Money"}
            </Button>
          </div>
        </div>
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle>Success</DialogTitle>
          <DialogDescription>Money has been successfully added to your Safevault.</DialogDescription>
          <Button onClick={() => setShowDialog(false)}>Close</Button>
        </DialogContent>
      </Dialog>
      <style jsx>{`
        .no-arrows::-webkit-inner-spin-button,
        .no-arrows::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-arrows {
          -moz-appearance: textfield;
        }
      `}</style>
    </Card>
  );
};

export default AddMoneyToSafevault;