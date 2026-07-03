import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateVAT } from "@/lib/tax-engine";

// GET /api/sales/quotations
export async function GET() {
  try {
    const quotations = await db.quotation.findMany({
      include: {
        customer: true,
        items: { include: { product: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    console.error("GET /api/sales/quotations error:", error);
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
  }
}

// POST /api/sales/quotations
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, items, validDays, notes } = body;

    // Generate quote number
    const count = await db.quotation.count();
    const quoteNo = `Q-2026-${String(count + 85).padStart(3, "0")}`;

    // Calculate totals
    let amount = 0;
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;
      amount += product.unitPrice * item.quantity;
    }
    const vatAmount = calculateVAT(amount);
    const total = amount + vatAmount;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (validDays || 14));

    const quotation = await db.quotation.create({
      data: {
        quoteNo,
        customerId,
        date: new Date(),
        validUntil,
        amount,
        vatAmount,
        total,
        notes,
        status: "sent",
        items: {
          create: items.map((item: { productId: string; quantity: number }) => {
            // We'll fetch product price again inside
            return { productId: item.productId, quantity: item.quantity, unitPrice: 0, total: 0 };
          }),
        },
      },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });

    // Update item prices from products
    for (const item of quotation.items) {
      const product = item.product;
      await db.quotationItem.update({
        where: { id: item.id },
        data: { unitPrice: product.unitPrice, total: product.unitPrice * item.quantity },
      });
    }

    // Refetch with updated items
    const finalQuote = await db.quotation.findUnique({
      where: { id: quotation.id },
      include: { customer: true, items: { include: { product: true } } },
    });

    await db.auditLog.create({
      data: {
        userName: "Hanna Mengistu",
        action: `Created quotation ${quoteNo}`,
        entity: "Sales",
        entityId: quotation.id,
        details: `Total: ${total} ETB for customer ${quotation.customer.name}`,
        ipAddress: "196.188.44.18",
      },
    });

    return NextResponse.json(finalQuote, { status: 201 });
  } catch (error) {
    console.error("POST /api/sales/quotations error:", error);
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
  }
}
