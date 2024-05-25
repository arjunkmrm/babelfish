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
import VideoPopup from "@/components/video-popup";

interface InsuranceProduct {
  id: number;
  name: string;
  type: string;
  amount: number;
}

interface InsurancePlansProps {
  currentPlans: InsuranceProduct[];
  otherPlans: InsuranceProduct[];
}

export default function InsurancePlansCard({ currentPlans, otherPlans }: InsurancePlansProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<InsuranceProduct | null>(null);
  const [showMorePopup, setShowMorePopup] = useState<boolean>(false);
  const [showBuyPopup, setShowBuyPopup] = useState<boolean>(false);

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleMoreClick = () => {
    setShowMorePopup(true);
  };

  const handleBuyClick = () => {
    // Your buy logic here
    setShowBuyPopup(true);
  };

  const handleCancelClick = () => {
    // Your cancel logic here
    setSelectedPlan(null);
  };

  const handleClosePopup = () => {
    setShowMorePopup(false);
    setShowBuyPopup(false);
  };

  const filteredCurrentPlans = currentPlans.filter((plan) => selectedType === 'all' || plan.type === selectedType);
  const filteredOtherPlans = otherPlans.filter((plan) => selectedType === 'all' || plan.type === selectedType);

  const isCurrentPlanSelected = selectedPlan && currentPlans.some(plan => plan.id === selectedPlan.id);
  const isOtherPlanSelected = selectedPlan && otherPlans.some(plan => plan.id === selectedPlan.id);

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <CardTitle>Insurance Plans</CardTitle>
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
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="life">Life</SelectItem>
              <SelectItem value="health">Health</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <CardTitle className="text-base">Your Current Plans</CardTitle>
          {filteredCurrentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex items-center justify-between p-4 rounded-lg bg-background hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out ${selectedPlan?.id === plan.id ? 'bg-gray-200' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div>
                <p className="text-sm font-medium leading-none">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.type}</p>
              </div>
              <div className="text-sm font-medium">${plan.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <CardTitle className="text-base">Other Plans</CardTitle>
          {filteredOtherPlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex items-center justify-between p-4 rounded-lg bg-background hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out ${selectedPlan?.id === plan.id ? 'bg-gray-200' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div>
                <p className="text-sm font-medium leading-none">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.type}</p>
              </div>
              <div className="text-sm font-medium">${plan.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={handleMoreClick}>More</Button>
          <div className="flex space-x-2">
            <Button onClick={handleCancelClick} disabled={!isCurrentPlanSelected}>Cancel</Button>
            <Button
              onClick={handleBuyClick}
              disabled={isCurrentPlanSelected}
            >
              Buy
            </Button>
          </div>
        </div>
      </CardContent>

      {showMorePopup && <VideoPopup onClose={handleClosePopup} />}
      {showBuyPopup && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
          <p className="text-lg">Insurance plan purchased</p>
          <div className="mt-auto self-end">
            <Button onClick={handleClosePopup}>Close</Button>
          </div>
        </div>
      )}

      {showBuyPopup && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
          <p className="text-lg">Insurance plan purchased</p>
          <div className="mt-4">
            <Button onClick={handleClosePopup}>Close</Button>
          </div>
        </div>
      )}
    </Card>
  );
}