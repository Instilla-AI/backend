import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Check if setup is complete by looking for a marker file
    const setupMarkerPath = join(process.cwd(), '.setup-complete');
    const isComplete = existsSync(setupMarkerPath);

    // Also check if essential env vars are set
    const hasDatabase = !!process.env.DATABASE_URL;
    const hasAuthSecret = !!process.env.BETTER_AUTH_SECRET;

    return NextResponse.json({
      isComplete: isComplete && hasDatabase && hasAuthSecret
    });
  } catch (error) {
    return NextResponse.json({ isComplete: false });
  }
}
