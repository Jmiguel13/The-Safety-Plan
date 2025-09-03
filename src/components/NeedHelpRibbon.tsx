import Link from "next/link";

export default function NeedHelpRibbon() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="https://www.veteranscrisisline.net/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
        style={{ borderColor:"rgba(0,229,255,0.5)", background:"rgba(15,19,26,0.9)", boxShadow:"0 10px 30px rgba(0,229,255,0.16)" }}
      >
        <span className="font-semibold">Need help now?</span>
        <span className="opacity-90">988 / 1 . 838255 . Chat</span>
      </Link>
    </div>
  );
}
