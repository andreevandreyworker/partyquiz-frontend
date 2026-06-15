export function errKey(message: string): string {
  const known = [
    "login_taken",
    "invalid_credentials",
    "room_not_found",
    "too_many_pending",
    "ai_unavailable",
    "not_host",
  ];
  return known.includes(message) ? `err_${message}` : "err_generic";
}
