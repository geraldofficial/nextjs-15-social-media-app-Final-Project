import { NextRequest } from "next/server";
import crypto from "crypto";

const BBB_ENDPOINT = process.env.BBB_ENDPOINT || "https://manager.bigbluemeeting.com/bigbluebutton/";
const BBB_SECRET = process.env.BBB_SECRET || "0TkGyZi5P3JhgX1wzDLigZsUTxTKjcd1kCrB52ILaY";

function getChecksum(query: string, secret: string) {
  return crypto.createHash("sha1").update(query + secret).digest("hex");
}

function getJoinUrl({ meetingID, fullName, isModerator = false, userID = "guest" }: { meetingID: string; fullName: string; isModerator?: boolean; userID?: string }) {
  const baseUrl = BBB_ENDPOINT.endsWith("/") ? BBB_ENDPOINT : BBB_ENDPOINT + "/";
  const params = [
    `meetingID=${encodeURIComponent(meetingID)}`,
    `fullName=${encodeURIComponent(fullName)}`,
    `password=${isModerator ? "mp" : "ap"}`,
    `userID=${encodeURIComponent(userID)}`
  ].join("&");
  const query = `join${params}`;
  const checksum = getChecksum("join" + params, BBB_SECRET);
  return `${baseUrl}api/join?${params}&checksum=${checksum}`;
}

export async function POST(req: NextRequest) {
  try {
    const { meetingID, fullName, isModerator } = await req.json();
    if (!meetingID || !fullName) {
      return Response.json({ error: "Missing meetingID or fullName" }, { status: 400 });
    }
    const url = getJoinUrl({ meetingID, fullName, isModerator });
    return Response.json({ url });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userName = url.searchParams.get("name") || "Guest";
    const meetingID = url.searchParams.get("meetingID") || "default-meeting";
    const userID = url.searchParams.get("userID") || "guest";

    // Create meeting if not exists
    const createMeetingParams = `name=Main+Room&meetingID=${meetingID}&attendeePW=ap&moderatorPW=mp`;
    const createMeetingChecksum = getChecksum("create" + createMeetingParams, BBB_SECRET);
    const createMeetingUrl = `${BBB_ENDPOINT}api/create?${createMeetingParams}&checksum=${createMeetingChecksum}`;
    await fetch(createMeetingUrl); // Ignore result, just ensure meeting exists

    // Generate join URL
    const joinUrl = getJoinUrl({ meetingID, fullName: userName, userID });
    return Response.json({ joinUrl });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate join URL" }, { status: 500 });
  }
}
