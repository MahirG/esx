import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/hr/employees/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee = await db.employee.findUnique({ where: { id } });
    if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    await db.attendance.deleteMany({ where: { employeeId: id } });
    await db.payroll.deleteMany({ where: { employeeId: id } });
    await db.leaveRequest.deleteMany({ where: { employeeId: id } });
    await db.employee.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userName: "Sara Tadesse",
        action: `Deleted employee ${employee.empId} - ${employee.name}`,
        entity: "HR",
        entityId: id,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE employee error:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}

// PATCH /api/hr/employees/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, position, department, salary, status } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (position) updateData.position = position;
    if (department) updateData.department = department;
    if (salary !== undefined) updateData.salary = parseFloat(salary);
    if (status) updateData.status = status;

    const employee = await db.employee.update({ where: { id }, data: updateData });

    await db.auditLog.create({
      data: {
        userName: "Sara Tadesse",
        action: `Updated employee ${employee.empId}`,
        entity: "HR",
        entityId: id,
        ipAddress: "196.188.44.22",
      },
    });
    return NextResponse.json(employee);
  } catch (error) {
    console.error("PATCH employee error:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}
