import { ENV } from "./env.js";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

function isLocalRequest(req) {
  const host = req.hostname || req.headers.host || "";
  const bareHost = host.split(":")[0];
  return LOCAL_HOSTS.has(bareHost);
}

export function getSessionCookieOptions(req) {
  const isLocal = isLocalRequest(req);
  const isSecure = !isLocal && (isSecureRequest(req) || ENV.isProduction);

  return {
    httpOnly: true,
    path: "/",
    // SameSite=None is REQUIRED for cross-origin cookies (Vercel → Render).
    // SameSite=Lax only works same-site. None requires Secure=true.
    sameSite: isLocal ? "lax" : "none",
    secure: isSecure,
  };
}
