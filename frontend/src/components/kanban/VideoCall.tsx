'use client';

import {
    LiveKitRoom,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Video } from 'lucide-react';

export default function VideoCall({
    roomName,
    userName,
    onClose
}: {
    roomName: string,
    userName: string,
    onClose: () => void
}) {
    const [token, setToken] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(
                    `/api/livekit?room=${roomName}&username=${userName}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [roomName, userName]);

    if (token === '') {
        return <div className="p-4 text-white">Connecting to meeting...</div>;
    }

    // Use a public LiveKit cloud URL or local one. 
    // For local development, change this to your LiveKit URL from .env
    const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://demo.livekit.cloud';

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-xl transition-all">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                        <Video size={16} />
                    </div>
                    <span className="font-semibold text-sm">Team Meeting</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <X size={16} />
                </Button>
            </div>

            <div className="h-[400px] w-full bg-zinc-950 relative flex flex-col">
                <LiveKitRoom
                    video={true}
                    audio={true}
                    token={token}
                    serverUrl={liveKitUrl}
                    data-lk-theme="default"
                    style={{ height: '100%' }}
                >
                    <MyGridLayout />
                    <RoomAudioRenderer />
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <ControlBar />
                    </div>
                </LiveKitRoom>
            </div>
        </div>
    );
}

function MyGridLayout() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );

    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100% - 60px)' }}>
            <ParticipantTile />
        </GridLayout>
    );
}
