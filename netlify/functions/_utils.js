const jwt = require("jsonwebtoken");

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  header.split(";").forEach((p) => {
    const [k, ...v] = p.trim().split("=");
    if (k) cookies[k] = v.join("=");
  });
  return cookies;
}

function verifyAuth(event) {
  const headerCookie = event.headers?.cookie || event.headers?.Cookie || "";
  const cookies = parseCookies(headerCookie);
  const token = cookies["cfp_token"];
  const secret = process.env.JWT_SECRET;
  if (!token || !secret)
    return { ok: false, statusCode: 401, message: "No token" };
  try {
    const payload = jwt.verify(token, secret);
    return { ok: true, payload };
  } catch (err) {
    return { ok: false, statusCode: 401, message: "Invalid token" };
  }
}

module.exports = { verifyAuth };
