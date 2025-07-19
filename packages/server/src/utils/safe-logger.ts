import { Request } from "express";

// Список полей, которые нужно маскировать
const SENSITIVE_FIELDS = [
  "password",
  "token",
  "secret",
  "key",
  "authorization",
  "cookie",
  "session",
];

// Функция для маскировки sensitive данных
function maskSensitiveData(obj: any): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(maskSensitiveData);
  }

  const masked = { ...obj };
  
  for (const [key, value] of Object.entries(masked)) {
    const lowerKey = key.toLowerCase();
    
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      masked[key] = "***MASKED***";
    } else if (typeof value === "object" && value !== null) {
      masked[key] = maskSensitiveData(value);
    }
  }
  
  return masked;
}

// Функция для извлечения безопасной информации из request
export function getSafeRequestInfo(req: Request) {
  const user = (req as any).user;
  
  return {
    requestId: req.requestId || "unknown",
    method: req.method,
    url: req.url,
    path: req.path,
    query: maskSensitiveData(req.query),
    body: maskSensitiveData(req.body),
    headers: maskSensitiveData(req.headers),
    user: user ? {
      id: user.id,
      username: user.username,
      roles: user.roles,
    } : null,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
  };
}

// Функция для извлечения безопасной информации из response
export function getSafeResponseInfo(res: any) {
  return {
    statusCode: res.statusCode,
    headers: maskSensitiveData(res.getHeaders()),
  };
}
 