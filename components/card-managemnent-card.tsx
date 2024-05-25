"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

interface CreditCard {
  id: number;
  name: string;
  image: string;
  active: boolean;
  overseasActive: boolean;
  spendingLimit: number;
  currentSpending: number;
}

interface CardsProps {
  cards: CreditCard[];
}

export default function CardsManagementCard({ cards }: CardsProps) {
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);

  const handleCardChange = (value: string) => {
    const card = cards.find((card) => card.name === value);
    setSelectedCard(card || null);
  };

  const handleActiveToggle = () => {
    if (selectedCard) {
      setSelectedCard({ ...selectedCard, active: !selectedCard.active });
    }
  };

  const handleOverseasToggle = () => {
    if (selectedCard) {
      setSelectedCard({ ...selectedCard, overseasActive: !selectedCard.overseasActive });
    }
  };

  const getProgressPercentage = () => {
    if (selectedCard) {
      return (selectedCard.currentSpending / selectedCard.spendingLimit) * 100;
    }
    return 0;
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Management</CardTitle>
        <Select value={selectedCard?.name || ""} onValueChange={handleCardChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a card" />
          </SelectTrigger>
          <SelectContent>
            {cards.map((card) => (
              <SelectItem key={card.id} value={card.name}>
                {card.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {selectedCard && (
          <div className="space-y-4">
            <img src={selectedCard.image} alt={selectedCard.name} className="w-full h-auto" />
            <div className="flex items-center justify-between">
              <span>Active:</span>
              <Switch checked={selectedCard.active} onCheckedChange={handleActiveToggle} />
            </div>
            <div className="flex items-center justify-between">
              <span>Travel Mode:</span>
              <Switch checked={selectedCard.overseasActive} onCheckedChange={handleOverseasToggle} />
            </div>
            <div>
              <p>Spending Limit: ${selectedCard.spendingLimit.toFixed(2)}</p>
              <Progress value={getProgressPercentage()} className="h-2 mt-2" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}