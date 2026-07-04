import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/admin/users/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await db.systemUser.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await db.auditLog.deleteMany({ where: { userId: id } });
    await db.systemUser.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Deleted user ${user.name}`,
        entity: "Admin",
        entityId: id,
        details: `Email: ${user.email}, Role: ${user.role}`,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

// PATCH /api/admin/users/[id] — update role/settings
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { role, twoFactor, biometric, status } = body;

    const updateData: Record<string, unknown> = {};
    if (role) updateData.role = role;
    if (twoFactor !== undefined) updateData.twoFactor = twoFactor;
    if (biometric !== undefined) updateData.biometric = biometric;
    if (status) updateData.status = status;

    const user = await db.systemUser.update({ where: { id }, data: updateData });

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Updated user ${user.name}`,
        entity: "Admin",
        entityId: id,
        details: `Role: ${user.role}`,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("PATCH user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
