"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function RegisterPayNow() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handlePhoneNumberChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (otpValue: SetStateAction<string>) => {
    setOtp(otpValue);
  };

  const handlePhoneNumberSubmit = () => {
    if (phoneNumber) {
      setShowOtpInput(true);
    }
  };

  const handleOtpSubmit = () => {
    // Simulate OTP verification and registration process
    if (otp.length === 6) {
      setIsRegistered(true);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <Card className="w-96 relative">
      <CardHeader>
        <CardTitle>Register PayNow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Phone Number"
            />
          </div>
          {!showOtpInput && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handlePhoneNumberSubmit}>
                Submit Phone Number
              </Button>
            </div>
          )}
          {showOtpInput && (
            <>
              <div>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  onChange={handleOtpChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleOtpSubmit}>
                  Submit OTP
                </Button>
              </div>
            </>
          )}
          {showPopup && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
              <p className="text-lg">
                PayNow registered for {phoneNumber}.
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