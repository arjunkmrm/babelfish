"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoanDetailsPopup from "@/components/loan/loan-details-popup"

interface Loan {
  id: number;
  name: string;
  type: string;
  duration: number;
  interestRate: number;
}


interface LoansProps {
  loans: Loan[];
}

export default function LoansCard({ loans }: LoansProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);
  const [showApplyPopup, setShowApplyPopup] = useState<boolean>(false);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleLoanSelect = (loan: Loan) => {
    setSelectedLoan(loan);
  };

  const handleDetailsClick = () => {
    setShowDetailsPopup(true);
  };

  const handleApplyClick = () => {
    // Your apply logic here
    setShowApplyPopup(true);
  };

  const handleClosePopup = () => {
    setShowDetailsPopup(false);
    setShowApplyPopup(false);
  };

  const filteredLoans = loans.filter((loan) => selectedType === 'all' || loan.type === selectedType);

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <CardTitle>Loans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <CardTitle className="text-base">Loans</CardTitle>
          {filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className={`flex items-center justify-between p-4 rounded-lg bg-background hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out ${selectedLoan?.id === loan.id ? 'bg-gray-200' : ''}`}
              onClick={() => handleLoanSelect(loan)}
            >
              <div>
                <p className="text-sm font-medium leading-none">{loan.name}</p>
                <p className="text-sm text-muted-foreground">{loan.type}</p>
              </div>
              <div className="text-sm font-medium">
                {loan.interestRate}% for {loan.duration} months
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={handleDetailsClick}>Details</Button>
          <Button onClick={handleApplyClick} disabled={selectedLoan === null}>
            Apply
          </Button>
        </div>
      </CardContent>

      {showDetailsPopup && <LoanDetailsPopup onClose={handleClosePopup} />}
      {showApplyPopup && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
          <p className="text-lg">Loan application submitted</p>
          <div className="mt-auto self-end">
            <Button onClick={handleClosePopup}>Close</Button>
          </div>
        </div>
      )}
    </Card>
  );
}