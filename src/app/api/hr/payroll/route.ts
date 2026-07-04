import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculatePayroll } from "@/lib/tax-engine";

// GET /api/hr/payroll
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "June 2026";

    const payrolls = await db.payroll.findMany({
      where: { period },
      include: { employee: true },
      orderBy: { employee: { name: "asc" } },
    });
    return NextResponse.json(payrolls);
  } catch (error) {
    console.error("GET /api/hr/payroll error:", error);
    return NextResponse.json({ error: "Failed to fetch payroll" }, { status: 500 });
  }
}

// POST /api/hr/payroll — run payroll for a period
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { period } = body;

    // Delete existing payroll for the period
    await db.payroll.deleteMany({ where: { period } });

    const employees = await db.employee.findMany({ where: { status: { not: "inactive" } } });

    const payrolls = [];
    for (const emp of employees) {
      const calc = calculatePayroll(emp.salary);
      const payroll = await db.payroll.create({
        data: {
          employeeId: emp.id,
          period,
          grossSalary: calc.grossSalary,
          pension: calc.pensionEmployee,
          incomeTax: calc.incomeTax,
          netPay: calc.netPay,
          status: "processed",
        },
        include: { employee: true },
      });
      payrolls.push(payroll);
    }

    const totalNet = payrolls.reduce((s, p) => s + p.netPay, 0);

    await db.auditLog.create({
      data: {
        userName: "Abebe Bekele",
        action: `Ran payroll for ${period}`,
        entity: "HR",
        details: `${payrolls.length} employees, Total net: ${totalNet} ETB`,
        ipAddress: "196.188.44.22",
      },
    });

    return NextResponse.json({ count: payrolls.length, totalNet, payrolls }, { status: 201 });
  } catch (error) {
    console.error("POST /api/hr/payroll error:", error);
    return NextResponse.json({ error: "Failed to run payroll" }, { status: 500 });
  }
}
