"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AccountBalanceProps {
  accounts: {
    id: number;
    name: string;
    avatar: string;
    balance: number;
  }[];
}

export default function AccountBalanceCard({ accounts }: AccountBalanceProps) {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Account Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background transition-colors duration-200 ease-in-out hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={account.avatar} alt={account.name} />
                  <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{account.name}</p>
                </div>
              </div>
              <p className="text-sm font-medium">${account.balance.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}