import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const room = req.nextUrl.searchParams.get('room');
    const username = req.nextUrl.searchParams.get('username');

    if (!room || !username) {
        return NextResponse.json(
            { error: 'Missing "room" or "username" parameter' },
            { status: 400 }
        );
    }

    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';

    const at = new AccessToken(apiKey, apiSecret, {
        identity: username,
        // Add additional participant metadata here if needed
    });

    at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();

    return NextResponse.json({ token });
}
