import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/users
export async function GET() {
  try {
    const users = await db.systemUser.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST /api/admin/users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role, twoFactor, biometric } = body;

    const existing = await db.systemUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const avatar = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    const user = await db.systemUser.create({
      data: {
        name,
        email,
        role: role || "staff",
        avatar,
        twoFactor: twoFactor ?? true,
        biometric: biometric ?? false,
        status: "offline",
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Created user ${name}`,
        entity: "Admin",
        entityId: user.id,
        details: `Role: ${role}, Email: ${email}`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
