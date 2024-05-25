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
import InvestmentDetailsPopup from "@/components/investment/investment-details-popup";

interface Investment {
  id: number;
  name: string;
  type: string;
  amount: number;
}

interface InvestmentsProps {
  investments: Investment[];
}

export default function InvestmentsCard({ investments }: InvestmentsProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);
  const [showBuyPopup, setShowBuyPopup] = useState<boolean>(false);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleInvestmentSelect = (investment: Investment) => {
    setSelectedInvestment(investment);
  };

  const handleDetailsClick = () => {
    setShowDetailsPopup(true);
  };

  const handleBuyClick = () => {
    // Your buy logic here
    setShowBuyPopup(true);
  };

  const handleSellClick = () => {
    // Your sell logic here
    setSelectedInvestment(null);
  };

  const handleClosePopup = () => {
    setShowDetailsPopup(false);
    setShowBuyPopup(false);
  };

  const filteredInvestments = investments.filter((investment) => selectedType === 'all' || investment.type === selectedType);

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <CardTitle>Investments</CardTitle>
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
              <SelectItem value="stocks">Stocks</SelectItem>
              <SelectItem value="bonds">Bonds</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <CardTitle className="text-base">Investments</CardTitle>
          {filteredInvestments.map((investment) => (
            <div
              key={investment.id}
              className={`flex items-center justify-between p-4 rounded-lg bg-background hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out ${selectedInvestment?.id === investment.id ? 'bg-gray-200' : ''}`}
              onClick={() => handleInvestmentSelect(investment)}
            >
              <div>
                <p className="text-sm font-medium leading-none">{investment.name}</p>
                <p className="text-sm text-muted-foreground">{investment.type}</p>
              </div>
              <div className="text-sm font-medium">${investment.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={handleDetailsClick}>Details</Button>
          <div className="flex space-x-2">
            <Button onClick={handleSellClick} disabled={selectedInvestment === null}>Sell</Button>
            <Button
              onClick={handleBuyClick}
              disabled={selectedInvestment !== null}
            >
              Buy
            </Button>
          </div>
        </div>
      </CardContent>

      {showDetailsPopup && <InvestmentDetailsPopup onClose={handleClosePopup} />}
      {showBuyPopup && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
          <p className="text-lg">Investment purchased</p>
          <div className="mt-auto self-end">
            <Button onClick={handleClosePopup}>Close</Button>
          </div>
        </div>
      )}
    </Card>
  );
}