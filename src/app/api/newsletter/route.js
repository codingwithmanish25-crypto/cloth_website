import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function serializeSubscriber(subscriber) {
  return {
    id: subscriber.id.toString(),
    email: subscriber.email,
    subscribedAt: subscriber.subscribedAt,
  };
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail },
    });

    return NextResponse.json({ subscriber: serializeSubscriber(subscriber) }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const requestedLimit = Number(searchParams.get("limit")) || 50;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        orderBy: { subscribedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsletterSubscriber.count(),
    ]);

    return NextResponse.json({
      subscribers: subscribers.map(serializeSubscriber),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Newsletter list error:", error);
    return NextResponse.json({ error: "Could not load newsletter subscribers" }, { status: 500 });
  }
}