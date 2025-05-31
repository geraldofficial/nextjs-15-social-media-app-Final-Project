"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

// This page will redirect the user to a BigBlueButton meeting using env variables
export default function BBBMeetingPage() {
  useEffect(() => {
    async function joinMeeting() {
      const meetingID = "default-meeting";
      const fullName =
        (typeof window !== "undefined" && window.localStorage.getItem("displayName")) ||
        "User";
      const userID = (typeof window !== "undefined" && window.localStorage.getItem("userID")) || "guest";
      const res = await fetch(`/api/bbb-join?meetingID=${encodeURIComponent(meetingID)}&name=${encodeURIComponent(fullName)}&userID=${encodeURIComponent(userID)}`);
      const data = await res.json();
      if (data.joinUrl) window.location.href = data.joinUrl;
    }
    joinMeeting();
  }, []);
  return <div className="p-8">Redirecting to BigBlueButton meeting...</div>;
}
