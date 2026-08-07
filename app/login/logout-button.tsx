import { logoutAction } from "./actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-xs font-semibold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink"
      >
        Sign out
      </button>
    </form>
  );
}
