import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userCredits, creditTransactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Get user credits
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user credits
    let credits = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, session.user.id),
    });

    // If user doesn't have credits record, create one with 100 free credits
    if (!credits) {
      await db.insert(userCredits).values({
        userId: session.user.id,
        credits: 100,
        totalUsed: 0,
      });

      // Log the initial credit transaction
      await db.insert(creditTransactions).values({
        userId: session.user.id,
        amount: 100,
        type: 'initial',
        description: 'Welcome bonus - 100 free credits',
      });

      credits = { userId: session.user.id, credits: 100, totalUsed: 0, createdAt: new Date(), updatedAt: new Date() };
    }

    return NextResponse.json({
      credits: credits.credits,
      totalUsed: credits.totalUsed,
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Use credits
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Get current credits
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, session.user.id),
    });

    if (!userCredit || userCredit.credits < amount) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // Deduct credits
    await db
      .update(userCredits)
      .set({
        credits: userCredit.credits - amount,
        totalUsed: userCredit.totalUsed + amount,
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, session.user.id));

    // Log transaction
    await db.insert(creditTransactions).values({
      userId: session.user.id,
      amount: -amount,
      type: 'usage',
      description: description || 'Credit usage',
    });

    return NextResponse.json({
      success: true,
      remainingCredits: userCredit.credits - amount,
    });
  } catch (error) {
    console.error('Error using credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
