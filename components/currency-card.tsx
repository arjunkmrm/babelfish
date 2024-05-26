"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getExchangeRate } from "@/lib/utils/exchangeRateService"; // Import the dummy exchange rate function

const currencies = ["USD", "EUR", "GBP", "JPY"]; // Example currency options

export default function CurrencyConverter() {
  const [startingCurrency, setStartingCurrency] = useState("USD");
  const [convertingCurrency, setConvertingCurrency] = useState("EUR");
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function fetchExchangeRate() {
      const rate = await getExchangeRate(startingCurrency, convertingCurrency);
      setExchangeRate(rate);
      setConvertedAmount(amount * rate);
    }
    fetchExchangeRate();
  }, [startingCurrency, convertingCurrency, amount]);

  const handleAmountChange = (e: { target: { value: string; }; }) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
    setConvertedAmount(value * exchangeRate);
  };

  const handleConvert = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          1 {startingCurrency} equals {exchangeRate.toFixed(2)} {convertingCurrency}
        </p>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount"
            />
            <Select value={startingCurrency} onValueChange={setStartingCurrency}>
              <SelectTrigger>
                <SelectValue>{startingCurrency}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-4">
            <Input
              type="number"
              value={convertedAmount}
              readOnly
              placeholder="Converted Amount"
            />
            <Select value={convertingCurrency} onValueChange={setConvertingCurrency}>
              <SelectTrigger>
                <SelectValue>{convertingCurrency}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleConvert}>
              Convert
            </Button>
          </div>

          {showPopup && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
              <p className="text-lg">
                {amount} {startingCurrency} equals {convertedAmount.toFixed(2)} {convertingCurrency}
              </p>
              <div className="mt-4">
                <Button onClick={handleClosePopup}>Close</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}