import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/hr/leave
export async function GET() {
  try {
    const requests = await db.leaveRequest.findMany({
      include: { employee: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("GET /api/hr/leave error:", error);
    return NextResponse.json({ error: "Failed to fetch leave requests" }, { status: 500 });
  }
}

// POST /api/hr/leave
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, type, startDate, endDate, reason } = body;

    const request = await db.leaveRequest.create({
      data: {
        employeeId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: "pending",
      },
      include: { employee: true },
    });

    await db.auditLog.create({
      data: {
        userName: request.employee.name,
        action: `Submitted leave request`,
        entity: "HR",
        entityId: request.id,
        details: `${type} from ${startDate} to ${endDate}`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("POST /api/hr/leave error:", error);
    return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 });
  }
}

// PATCH /api/hr/leave — approve/reject
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body; // approved | rejected

    const request = await db.leaveRequest.update({
      where: { id },
      data: { status },
      include: { employee: true },
    });

    // If approved, update employee status
    if (status === "approved") {
      await db.employee.update({
        where: { id: request.employeeId },
        data: { status: "leave" },
      });
    }

    await db.auditLog.create({
      data: {
        userName: "Sara Tadesse",
        action: `${status === "approved" ? "Approved" : "Rejected"} leave for ${request.employee.name}`,
        entity: "HR",
        entityId: request.id,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error("PATCH /api/hr/leave error:", error);
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 });
  }
}
