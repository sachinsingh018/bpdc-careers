"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ScanErrorBoundary } from "@/components/ScanErrorBoundary";

const QRScanner = dynamic(() => import("@/components/scan/QRScanner").then((m) => ({ default: m.QRScanner })), {
    ssr: false,
    loading: () => <div className="py-12 text-center text-neutral-500">Loading camera…</div>,
});

const DETECTION_DELAY = 900;

export default function ScanPage() {
    const router = useRouter();
    const [started, setStarted] = useState(false);
    const [preparing, setPreparing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingPath, setPendingPath] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!pendingPath) return;
        const timer = setTimeout(() => {
            router.push(pendingPath);
        }, DETECTION_DELAY);
        return () => clearTimeout(timer);
    }, [pendingPath, router]);

    const handleManualEntry = () => {
        const input = window.prompt("Enter profile URL or ID (e.g. /p/abc-123 or abc-123):");
        if (!input?.trim()) return;
        let path: string;
        if (input.startsWith("/")) {
            path = input;
        } else if (input.startsWith("http") && input.includes("/p/")) {
            try {
                path = new URL(input).pathname;
            } catch {
                path = `/p/${input}`;
            }
        } else {
            path = `/p/${input}`;
        }
        router.push(path);
    };

    const handleDetected = (path: string) => {
        setStatusMessage("Opening profile…");
        setPendingPath(path);
    };

    return (
        <div className="mx-auto max-w-lg px-4 py-10">
            <h1 className="text-2xl font-semibold text-neutral-900">Scan a student&apos;s QR code</h1>
            <p className="mt-2 text-neutral-600">
                Point your camera at the QR code printed on the student&apos;s badge or phone. You&apos;ll open their profile in a
                second.
            </p>

            <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                {!started && !pendingPath ? (
                    <div className="flex flex-col gap-6 text-center">
                        {preparing ? (
                            <>
                                <div className="mx-auto h-24 w-24 animate-pulse rounded-full bg-neutral-100" />
                                <p className="text-base font-medium text-neutral-800">Preparing camera…</p>
                                <p className="text-sm text-neutral-500">Please wait a moment</p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto h-24 w-24 rounded-full bg-neutral-100" />
                                <div>
                                    <p className="text-base font-medium text-neutral-800">Ready when you are</p>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Turn on the camera to scan. We&apos;ll guide you if anything looks off.
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm text-neutral-500">
                                    <p>• Hold the QR code steady in the frame</p>
                                    <p>• Allow camera access when prompted</p>
                                    <p>• Tap below if you prefer to paste a link</p>
                                </div>
                                <Button
                                    onClick={() => {
                                        setError(null);
                                        setStatusMessage(null);
                                        setPreparing(true);
                                        setTimeout(() => {
                                            setPreparing(false);
                                            setStarted(true);
                                        }, 350);
                                    }}
                                >
                                    Start camera
                                </Button>
                            </>
                        )}
                    </div>
                ) : null}

                {started && !pendingPath ? (
                    <ScanErrorBoundary
                        onReset={() => {
                            setError(null);
                            setStarted(false);
                        }}
                    >
                        <div className="space-y-6">
                            <QRScanner
                                onError={(message) => {
                                    setError(message);
                                    setStatusMessage(null);
                                    setPendingPath(null);
                                    setStarted(false);
                                }}
                                onStop={() => setStarted(false)}
                                onDetected={handleDetected}
                            />
                            <p className="text-center text-sm text-neutral-500">
                                Align the QR code inside the square. We&apos;ll open the profile as soon as it&apos;s detected.
                            </p>
                        </div>
                    </ScanErrorBoundary>
                ) : null}

                {pendingPath ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-neutral-600">
                        <span className="inline-flex h-8 w-8 items-center justify-center">
                            <span className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </span>
                        <p className="text-sm">{statusMessage}</p>
                    </div>
                ) : null}

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={handleManualEntry}
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline"
                    >
                        Enter profile link manually
                    </button>
                </div>
            </div>
        </div>
    );
}
