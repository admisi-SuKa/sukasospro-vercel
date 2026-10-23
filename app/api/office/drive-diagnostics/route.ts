import { NextRequest, NextResponse } from 'next/server';
import { getOfficeRequest } from '../../../../lib/office';
import { driveConfigurationStatus, probeDriveBridge } from '../../../../lib/drive';

export const dynamic = 'force-dynamic';

/**
 * Accessible to a logged-in Admin only.
 * Does not expose full deployment URL, deployment ID, API secret, or folder ID.
 */
export async function GET(req: NextRequest) {
  const user = getOfficeRequest(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Login Admin diperlukan.' }, { status: 401 });
  const configuration = driveConfigurationStatus();
  const connectivity = configuration.endpointValid && configuration.secretConfigured
    ? await probeDriveBridge()
    : { reachable: false, message: configuration.message };
  return NextResponse.json({ configuration, connectivity }, { headers: { 'Cache-Control': 'no-store' } });
}
