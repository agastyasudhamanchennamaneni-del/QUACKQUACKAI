let requests = {};

export default function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (!requests[ip]) requests[ip] = [];
  requests[ip] = requests[ip].filter(ts => now - ts < 60000);
  if (requests[ip].length > 20) {
    return res.status(429).json({ error: 'Too many requests, slow down.' });
  }
  requests[ip].push(now);
  next();
}
