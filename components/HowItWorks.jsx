"use client";

import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, Gauge, ShieldCheck, Lock, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ChatMessage from "./ChatMessage";

const fullChatScript = [
  { sender: "user", text: "Okay, I want to get a handle on my online privacy. Where do I start?", icon: null },
  { sender: "privmat", text: "Great! First, let's track where your data might be. Add the apps and services you use.", icon: <PlusCircle /> },
  { sender: "user", text: "Done! Added Facebook, Google, and that shopping site I signed up for.", icon: null },
  { sender: "privmat", text: "Perfect. Privmat now helps you assess your exposure. We'll show you a Risk Score based on the data shared...", icon: <Gauge /> },
  { sender: "privmat", text: "...and we constantly check if the email linked to your account appears in known data breaches.", icon: <ShieldCheck /> },
  { sender: "user", text: "Wow, okay. My risk is 'Medium'. What can I do to protect myself better?", icon: null },
  { sender: "privmat", text: "You're in control! Use our Fake Data Generator for less important signups, and secure your critical passwords in the encrypted Data Vault.", icon: <Lock /> },
  { sender: "user", text: "Got it. Track, Assess, Protect. Seems much clearer now!", icon: null },
];

const HowItWorksChat = () => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const chatContainerRef = useRef(null);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const startChat = () => {
    setDisplayedMessages([]);
    let index = 0;

    const displayNext = () => {
      if (index < fullChatScript.length) {
        const msg = fullChatScript[index];
        const delay = 800 + Math.min(msg.text.length * 30, 3000);

        setIsTyping(true);

        const typingTimeout = setTimeout(() => {
          setDisplayedMessages(prev => [...prev, msg]);
          setIsTyping(false);
          index++;

          const nextTimeout = setTimeout(displayNext, 300);
          timeoutsRef.current.push(nextTimeout);
        }, delay);

        timeoutsRef.current.push(typingTimeout);
      }
    };

    const initialTimeout = setTimeout(displayNext, 500);
    timeoutsRef.current.push(initialTimeout);
  };

  useEffect(() => {
    startChat();
    return clearAllTimeouts;
  }, []);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedMessages, isTyping]);

  const resetConversation = () => {
    if (isResetting) return;
    setIsResetting(true);
    clearAllTimeouts();
    setDisplayedMessages([]);
    setIsTyping(false);

    let index = 0;

    const displayNext = () => {
      if (index < fullChatScript.length) {
        const msg = fullChatScript[index];
        const delay = 800 + Math.min(msg.text.length * 30, 3000);

        setIsTyping(true);

        const typingTimeout = setTimeout(() => {
          setDisplayedMessages(prev => [...prev, msg]);
          setIsTyping(false);
          index++;

          const nextTimeout = setTimeout(displayNext, 300);
          timeoutsRef.current.push(nextTimeout);
        }, delay);

        timeoutsRef.current.push(typingTimeout);
      } else {
        setIsResetting(false);
      }
    };

    const initialTimeout = setTimeout(displayNext, 500);
    timeoutsRef.current.push(initialTimeout);
  };

  return (
    <section className="py-8 md:py-16 bg-transparent">
      <div className="container mx-auto px-8 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
          {/* Left Section (Text) */}
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
              How Privmat Works (In a Nutshell)
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 md:mb-16 max-w-2xl mx-auto">
              Follow this quick chat to see how easy privacy management can be.
            </p>
          </div>

          {/* Right Section (Chat Card) */}
          <div className="md:w-1/2 w-full">
            <Card className="shadow-lg rounded-lg overflow-hidden bg-white dark:bg-slate-950 relative">
              <CardContent
                ref={chatContainerRef}
                className="p-4 md:p-6 space-y-4 h-[400px] md:h-[500px] overflow-y-auto scroll-smooth custom-scrollbar"
              >
                {displayedMessages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    msg={msg}
                    index={index}
                    isTyping={false}
                  />
                ))}

                {isTyping && (
                  <ChatMessage
                    key={"typing"}
                    msg={{
                      sender: "privmat",
                      text: "",
                      icon: fullChatScript[displayedMessages.length]?.icon || null,
                    }}
                    index={displayedMessages.length}
                    isTyping={true}
                  />
                )}

                {/* Spacer */}
                <div className="h-4"></div>

                {/* Reset/Replay Button */}
                <div
                  onClick={resetConversation}
                  disabled={isResetting}
                  className="absolute bottom-4 right-4 bg-[#0045b4] text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-all"
                >
                  <RotateCcw className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksChat;
