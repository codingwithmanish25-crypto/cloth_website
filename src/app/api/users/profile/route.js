import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to extract user via Bearer token or SSR cookies
async function getAuthenticatedUser(request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  if (token) {
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (!error && user) return user;
  }

  const { data: { user } } = await supabaseServer.auth.getUser();
  return user;
}

// GET: Fetch User Data from DB
export async function GET(request) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        username: true,
        emails: true,
        phones: true,
        addresses: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET Profile Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT: Update Emails, Phones, Addresses in DB
export async function PUT(request) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emails, phones, addresses } = body;

    const updateData = {};
    if (emails !== undefined) updateData.emails = emails;
    if (phones !== undefined) updateData.phones = phones;
    if (addresses !== undefined) updateData.addresses = addresses;

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}