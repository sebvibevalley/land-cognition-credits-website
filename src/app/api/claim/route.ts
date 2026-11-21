import { NextResponse } from 'next/server';

// Static export only supports GET route handlers, so the POST claim
// endpoint cannot exist on the Pages deployment. The client falls back to
// the in-memory mock claim when this route is unreachable.
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    status: 'static',
    message: 'Claim submissions are not served by the static deployment.',
  });
}
