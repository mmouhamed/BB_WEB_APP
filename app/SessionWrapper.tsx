"use client"; // Mark this as a client component

import { SessionProvider } from "next-auth/react";

interface SessionWrapperProps {
  children: React.ReactNode;
  session: any; // Type the session prop if needed
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
