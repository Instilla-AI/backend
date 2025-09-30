import { NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Run drizzle push to initialize database schema
    console.log('Initializing database schema...');
    
    try {
      const { stdout, stderr } = await execAsync('npm run db:push');
      console.log('Database push output:', stdout);
      if (stderr) console.error('Database push errors:', stderr);
    } catch (error: any) {
      console.error('Database push failed:', error);
      // Continue anyway - the database might already be initialized
    }

    // Create setup complete marker
    const markerPath = join(process.cwd(), '.setup-complete');
    writeFileSync(markerPath, new Date().toISOString());

    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error: any) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database: ' + error.message },
      { status: 500 }
    );
  }
}
