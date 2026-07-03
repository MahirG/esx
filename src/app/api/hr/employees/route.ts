import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/hr/employees
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { empId: { contains: search } },
        { position: { contains: search } },
      ];
    }
    if (department && department !== "all") {
      where.department = department;
    }

    const employees = await db.employee.findMany({
      where,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("GET /api/hr/employees error:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// POST /api/hr/employees
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, position, department, salary, joinDate, empId } = body;

    // Generate emp ID if not provided
    let finalEmpId = empId;
    if (!finalEmpId) {
      const count = await db.employee.count();
      finalEmpId = `E-${String(count + 1).padStart(3, "0")}`;
    }

    const existing = await db.employee.findUnique({ where: { empId: finalEmpId } });
    if (existing) {
      return NextResponse.json({ error: "Employee ID already exists" }, { status: 400 });
    }

    const employee = await db.employee.create({
      data: {
        empId: finalEmpId,
        name,
        email,
        phone,
        position,
        department,
        salary: parseFloat(salary),
        joinDate: joinDate ? new Date(joinDate) : new Date(),
        status: "active",
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Sara Tadesse",
        action: `Added employee ${finalEmpId} - ${name}`,
        entity: "HR",
        entityId: employee.id,
        details: `${position} in ${department}, Salary: ${salary} ETB`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("POST /api/hr/employees error:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
