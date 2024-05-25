"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface PaymentProps {
  payments: {
    id: number;
    name: string;
    group: string;
    avatar: string;
  }[];
}

export default function PaymentCard({ payments }: PaymentProps) {
  const [selectedPayments, setSelectedPayments] = useState<{ id: number; amount: number }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [filteredPayments, setFilteredPayments] = useState(payments);
  const [showPaidPopup, setShowPaidPopup] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      setFilteredPayments(payments.filter(payment => payment.group === selectedGroup));
    } else {
      setFilteredPayments(payments);
    }
  }, [selectedGroup, payments]);

  const handleAmountChange = (id: number, amount: number) => {
    setSelectedPayments((prevSelectedPayments) => {
      const existingPayment = prevSelectedPayments.find((payment) => payment.id === id);
      if (existingPayment) {
        return prevSelectedPayments.map((payment) =>
          payment.id === id ? { ...payment, amount } : payment
        );
      } else {
        return [...prevSelectedPayments, { id, amount }];
      }
    });
  };

  const handlePay = () => {
    // Handle payment logic here
    console.log("Selected payments:", selectedPayments);
    setShowPaidPopup(true);
  };

  const handleClosePaidPopup = () => {
    setShowPaidPopup(false);
  };

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Transfer</CardTitle>
          <Select onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friends">Friends</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="flatmates">Flatmates</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background transition-colors duration-200 ease-in-out hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={payment.avatar} alt={payment.name} />
                  <AvatarFallback>{payment.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{payment.name}</p>
                </div>
              </div>
              <Input
                type="number"
                placeholder="Amount"
                className="w-24"
                onChange={(e) => handleAmountChange(payment.id, parseFloat(e.target.value))}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handlePay} disabled={selectedPayments.length === 0}>
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