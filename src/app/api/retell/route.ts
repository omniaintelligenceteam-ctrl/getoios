import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const DEFAULT_AGENT_ID = 'agent_b8f7dab7124e978dacac4a3b60';

// Valid agent IDs for trade-specific demos
const VALID_AGENTS = new Set([
  'agent_b8f7dab7124e978dacac4a3b60',  // OIOS Business Line (default)
  'agent_5c7497a9685bfbf3fe546f07e7',  // Mike's Plumbing
  'agent_61fc1cc265e6885ac41dcfb527',  // Cool Air HVAC
  'agent_032f8dd6a242ac38256c7b9954',  // Premier Outdoor Lighting
  'agent_70a42030363e2899b96acdf85a',  // Sparks Electrical
]);

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Validate required env var
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      console.error('RETELL_API_KEY not configured');
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const agentId = VALID_AGENTS.has(body.agent_id) ? body.agent_id : DEFAULT_AGENT_ID;

    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${retellApiKey}`,
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    });

    if (!response.ok) {
      console.error('Retell API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to create web call' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      access_token: data.access_token,
      call_id: data.call_id
    });
  } catch (error) {
    console.error('Error creating web call:', error);
    return NextResponse.json(
      { error: 'Failed to create web call' },
      { status: 500 }
    );
  }
}
