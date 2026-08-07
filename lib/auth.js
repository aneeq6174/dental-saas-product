import { NextResponse } from "next/server";

export function requireAdminSecret(req) {
  const provided = req.headers.get("x-admin-secret");
  if (!provided || provided !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}