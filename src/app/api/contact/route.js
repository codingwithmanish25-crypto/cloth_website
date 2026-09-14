import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/authUser";

const contactSchema = z.object({
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(5000),
});

function serializeMessage(message) {
  return JSON.parse(
    JSON.stringify(message, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function POST(request) {
  try {
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email and message of at least 10 characters",
        },
        { status: 400 },
      );
    }

    const message = await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json(serializeMessage(message), { status: 201 });
  } catch (error) {
    console.error("Create contact message error:", error);
    return NextResponse.json(
      { error: "Could not send your message" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (authUser?.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = new URL(request.url).searchParams;
    const exportAll = searchParams.get("export") === "csv";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = 10;

    if (exportAll) {
      const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
      const rows = [
        ["ID", "Email", "Message", "Status", "Created At"],
        ...messages.map((message) => [
          message.id,
          message.email,
          message.message,
          message.status,
          new Date(message.createdAt).toLocaleString("en-IN"),
        ]),
      ];
      const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
      return new NextResponse("\uFEFF" + csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="contact-queries-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({
      messages: messages.map(serializeMessage),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    console.error("Load contact messages error:", error);
    return NextResponse.json(
      { error: "Could not load contact queries" },
      { status: 500 },
    );
  }
}
