import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/sales/customers/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const customer = await db.customer.findUnique({ where: { id } });
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    await db.quotationItem.deleteMany({
      where: { quotation: { customerId: id } },
    });
    await db.quotation.deleteMany({ where: { customerId: id } });
    await db.pipelineDeal.deleteMany({ where: { customerId: id } });
    await db.customer.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        userName: "Hanna Mengistu",
        action: `Deleted customer ${customer.name}`,
        entity: "Sales",
        entityId: id,
        ipAddress: "196.188.44.18",
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE customer error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}

// PATCH /api/sales/customers/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, contact, email, address, status } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (contact) updateData.contact = contact;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (status) updateData.status = status;

    const customer = await db.customer.update({ where: { id }, data: updateData });

    await db.auditLog.create({
      data: {
        userName: "Hanna Mengistu",
        action: `Updated customer ${customer.name}`,
        entity: "Sales",
        entityId: id,
        ipAddress: "196.188.44.18",
      },
    });
    return NextResponse.json(customer);
  } catch (error) {
    console.error("PATCH customer error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
