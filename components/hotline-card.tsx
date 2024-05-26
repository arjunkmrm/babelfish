"use client";
import { Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const CallHotline = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCallClick = () => {
    setIsLoading(true);
    // Simulate a delay for the loading state
    setTimeout(() => {
      setIsLoading(false);
      // Perform the actual call logic here
      console.log("Calling the hotline...");
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Hotline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/path/to/avatar-image.jpg" alt="Avatar" />
            <AvatarFallback>HT</AvatarFallback>
          </Avatar>
          <Button onClick={handleCallClick} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Calling...
              </div>
            ) : (
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Call Hotline
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallHotline;