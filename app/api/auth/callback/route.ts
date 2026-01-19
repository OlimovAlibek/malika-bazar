import { NextResponse } from "next/server";

export async function GET() {
  // Supabase auth callback handler
  return NextResponse.json({ message: "Auth callback" });
}
