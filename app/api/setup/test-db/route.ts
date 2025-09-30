import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

export async function POST(request: NextRequest) {
  try {
    const { databaseUrl } = await request.json();

    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'Database URL is required' },
        { status: 400 }
      );
    }

    // Test connection
    const sql = postgres(databaseUrl, { max: 1 });
    
    try {
      await sql`SELECT 1`;
      await sql.end();
      
      return NextResponse.json({ success: true, message: 'Connection successful' });
    } catch (error: any) {
      await sql.end();
      throw error;
    }
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database: ' + error.message },
      { status: 500 }
    );
  }
}
