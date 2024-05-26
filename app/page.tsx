"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import { type AI } from "./action";
import { UserMessage } from "@/components/message";
import { Button } from "@/components/ui/button"; // Assuming you have the ShadCN button component
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"; // Assuming you have the ShadCN dialog component
import { Mic } from "lucide-react"; // Assuming you have the Lucide icon library
import dotenv from 'dotenv';
dotenv.config();

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addAudioElement = async (blob: Blob) => {
    console.log("addAudioElement function called");

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');

      const response = await fetch('http://localhost:3001/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Transcription:", data.transcription);

      // Treat the transcription as user input and proceed
      const userMessage = data.transcription;
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          display: <UserMessage>{userMessage}</UserMessage>,
        },
      ]);
      const responseMessage = await submitMessage(userMessage);
      setMessages((currentMessages) => [
        ...currentMessages,
        responseMessage,
      ]);

    } catch (error) {
      console.error("Error in addAudioElement:", error);
      setIsDialogOpen(true); // Open dialog when there's an error
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Media devices are not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream, { audioBitsPerSecond: 128000 });
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          addAudioElement(event.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        setMediaRecorder(null);
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
          setMediaStream(null);
        }
      };
    } catch (err) {
      console.error("Error accessing media devices.", err);
      setIsDialogOpen(true); // Open dialog when there's an error
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 relative">
      {messages.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontFamily: 'Georgia, serif',
            color: 'rgba(74, 85, 104, 0.5)', // Lighter shade and reduced opacity
          }}
        >
        Good Morning
          </div>

      )}
      <div className="flex flex-col space-y-4 w-full max-w-2xl mb-16">
        {
          // View messages in UI state
          messages.map((message) => (
            <div key={message.id}>{message.display}</div>
          ))
        }
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const value = inputValue.trim();
          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <UserMessage>{value}</UserMessage>,
            },
          ]);
          // Submit and get response message
          const responseMessage = await submitMessage(inputValue);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);
          setInputValue("");
        }}
        className="fixed bottom-0 w-full max-w-2xl p-4 bg-white"
      >
        <div className="flex items-center">
          <input
            placeholder="Send a message... (e.g. I want to convert my currency)"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            className="border border-border rounded-md p-2 w-full focus:outline-none"
          />
          <Button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`ml-2 p-2 rounded-full ${isRecording ? 'bg-gray-700' : 'bg-transparent'} hover:bg-gray-500 focus:bg-dark`}
            style={{ outline: 'none' }}
          >
            <Mic className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-black'} hover:text-white`} />
          </Button>
        </div>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Server Connection Error</DialogTitle>
            <DialogDescription>
              There was an error connecting to the server. Please try again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
