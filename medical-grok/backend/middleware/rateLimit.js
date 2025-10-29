// backend/middleware/rateLimit.js
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: { error: "Too many requests. Please try again later." },
});

export default limiter;
