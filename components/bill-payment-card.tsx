"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BillPaymentProps {
  bills: {
    id: number;
    organization: string;
    amount: number;
    dueDate: string;
    logo: string;
  }[];
}

export default function BillPaymentCard({ bills }: BillPaymentProps) {
  const [selectedBills, setSelectedBills] = useState<number[]>([]);
  const [showPaidPopup, setShowPaidPopup] = useState(false);

  const handleBillSelection = (billId: number) => {
    setSelectedBills((prevSelectedBills) => {
      if (prevSelectedBills.includes(billId)) {
        return prevSelectedBills.filter((id) => id !== billId);
      } else {
        return [...prevSelectedBills, billId];
      }
    });
  };

  const handlePayBills = () => {
    // Handle payment logic here
    console.log("Selected bills:", selectedBills);
    setShowPaidPopup(true);
  };

  const handleClosePaidPopup = () => {
    setShowPaidPopup(false);
  };

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`flex items-center justify-between p-4 rounded-lg bg-background transition-colors duration-200 ease-in-out ${
                selectedBills.includes(bill.id) ? "bg-gray-100" : "hover:bg-gray-50 cursor-pointer"
              }`}
              onClick={() => handleBillSelection(bill.id)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={bill.logo} alt={bill.organization} />
                  <AvatarFallback>{bill.organization.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{bill.organization}</p>
                  <p className="text-sm text-muted-foreground">Due: {bill.dueDate}</p>
                </div>
              </div>
              <div className="text-sm font-medium">${bill.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handlePayBills} disabled={selectedBills.length === 0}>
            Pay
          </Button>
        </div>

        {showPaidPopup && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
            <p className="text-lg">Paid!</p>
            <div className="mt-4">
              <Button onClick={handleClosePaidPopup}>Close</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}