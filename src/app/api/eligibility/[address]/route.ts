import { NextResponse } from 'next/server';

// A static export cannot answer live eligibility. The /eligibility page reads
// the LAND balance straight from Polygon in the browser instead, so this
// endpoint exists only to answer the URLs baked in at build time, and it never
// returns a made-up allocation.
const STATIC_ADDRESSES = [
  '0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
  '0x86ef88559e9cad9274981b0256d15960c38476d3',
];

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_ADDRESSES.map((address) => ({ address }));
}

export async function GET(_request: Request, { params }: { params: { address: string } }) {
  return NextResponse.json(
    {
      address: params.address,
      status: 'static',
      message:
        'This static deployment cannot answer live eligibility. Open /eligibility to read the LAND balance from Polygon in your browser. No credit allocation is returned because the distributor contract is not deployed yet.',
    },
    { status: 503 },
  );
}
