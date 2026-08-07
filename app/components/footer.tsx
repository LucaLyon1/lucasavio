export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-300 px-6 py-6">
        <p className="text-xs text-ink/50">© {new Date().getFullYear()} Luca Savio.</p>
      </div>
    </footer>
  );
}
