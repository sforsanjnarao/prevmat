// components/breach-checker/ErrorMessageWithExternalLink.jsx

"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you use ShadCN Button

const ErrorMessageWithExternalLink = ({ message, externalUrl, externalUrlText }) => {
  if (!message) return null;

  return (
    <div className="mt-4 p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive dark:border-destructive/70 dark:bg-destructive/20 dark:text-red-400">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Oops! Something went wrong.</p>
          <p className="text-xs mt-1">{message}</p>
          {externalUrl && externalUrlText && (
            <p className="text-xs mt-2">
              If the issue persists, you can also try checking directly on the{" "}
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline hover:text-destructive/80 dark:hover:text-red-300"
              >
                {externalUrlText} <ExternalLink className="inline-block h-3 w-3 ml-0.5" />
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessageWithExternalLink;    