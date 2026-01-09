import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/dal';
import { logger, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * GET /api/leads
 * List leads with multi-tenant filtering
 *
 * NOTE: Leads table not yet implemented in database schema.
 * This endpoint returns empty data until the leads table is created.
 *
 * Authorization:
 * - SuperAdmin: Can view all leads (optionally filter by clientId)
 * - Client Admin: Can only view leads from their organization
 *
 * Query params: clientId, crewId, status
 */
export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // Verify authentication using DAL
    const session = await verifyAuth();

    await logger.info('Fetch leads request received (placeholder)', {
      requestId,
      userId: session.user.id,
    });

    // TODO: Implement leads table in database schema
    // For now, return empty array
    const duration = Date.now() - startTime;
    await logger.info('Leads fetched (placeholder - feature not implemented)', {
      requestId,
      userId: session.user.id,
      duration,
      operation: 'fetch_leads',
    });

    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      message: 'Leads feature coming soon - database table not yet implemented',
      requestId,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to fetch leads',
      {
        requestId,
        duration,
        operation: 'fetch_leads',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
