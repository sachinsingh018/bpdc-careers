import dynamic from "next/dynamic";

const ScanClient = dynamic(() => import("./ScanClient").then((m) => ({ default: m.ScanClient })), {
  ssr: false,
});

export default function ScanPage() {
  return <ScanClient />;
}
