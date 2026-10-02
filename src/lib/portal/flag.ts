/**
 * The client portal is unfinished and must not be reachable in production (spec D5).
 * It is on only when PORTAL_ENABLED is exactly "true"; prod does not set it.
 */
export function isPortalEnabled(): boolean {
  return process.env.PORTAL_ENABLED === "true";
}
