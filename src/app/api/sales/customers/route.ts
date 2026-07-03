import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/sales/customers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { contact: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const customers = await db.customer.findMany({
      where,
      orderBy: { lifetimeValue: "desc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET /api/sales/customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST /api/sales/customers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, email, address, status } = body;

    const customer = await db.customer.create({
      data: {
        name,
        contact,
        email,
        address,
        status: status || "regular",
      },
    });

    await db.auditLog.create({
      data: {
        userName: "Hanna Mengistu",
        action: `Added customer ${name}`,
        entity: "Sales",
        entityId: customer.id,
        details: `Contact: ${contact}`,
        ipAddress: "196.188.44.18",
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("POST /api/sales/customers error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
