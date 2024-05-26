"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: number;
  name: string;
  date: string;
  time: string;
  amount: number;
  isScam?: boolean;
}

interface PastTransactionsProps {
  transactions: Transaction[];
}

export default function PastTransactionsCard({ transactions }: PastTransactionsProps) {
  const [showDetailsPopup, setShowDetailsPopup] = useState<null | Transaction>(null);

  const handleTransactionClick = (transaction: Transaction) => {
    setShowDetailsPopup(transaction);
  };

  const handleCloseDetailsPopup = () => {
    setShowDetailsPopup(null);
  };

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <CardTitle>Past Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out"
              onClick={() => handleTransactionClick(transaction)}
              style={{backgroundColor: transaction.isScam? 'red': 'white'}}
            >
              <div>
                <p className="text-sm font-medium leading-none">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date} at {transaction.time}
                </p>
              </div>
              <div className="text-sm font-medium">${transaction.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {showDetailsPopup && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
            <p className="text-lg">{showDetailsPopup.name}</p>
            <p className="text-sm text-muted-foreground">
              {showDetailsPopup.date} at {showDetailsPopup.time}
            </p>
            <p className="text-lg font-medium mt-2">${showDetailsPopup.amount.toFixed(2)}</p>
            <div className="mt-4">
              <Button onClick={handleCloseDetailsPopup}>Close</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}