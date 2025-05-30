import { cookies } from "next/headers";
import { lucia } from "@/lib/lucia";

export async function getAuthSession() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;
  if (!sessionId) return null;
  
  const { session, user } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // Next.js throws error when attempting to set cookies in RSCs
  }
  if (!session) return null;
  return { user, session };
}

export async function validateRequest() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;
  if (!sessionId) return { user: null, session: null };
  const { session, user } = await lucia.validateSession(sessionId);
  try {
    if (session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // Next.js throws error when attempting to set cookies in RSCs
  }
  return { user, session };
}
