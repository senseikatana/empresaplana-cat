# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.0.x | Yes |
| < 2.0 | No |

## Reporting a Vulnerability

Report security issues to **security@empresaplana.cat**. Do not open public GitHub issues for security vulnerabilities.

Include in your report:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

We aim to acknowledge reports within 48 hours and provide a fix timeline within 7 days.

## Authentication

- **JWT sessions** via `jose` (HS256), 7-day expiry, stored in `httpOnly` cookie named `ep_session`
- **Passwords** hashed with `scrypt` (salt:hash format)
- **ACL** WordPress-style: roles (`client` / `worker` / `admin`) mapped to granular capabilities

## Security Best Practices

- All API routes require authentication unless explicitly public
- CSRF protection via SameSite cookie policy
- Rate limiting on authentication endpoints
- Input validation with Zod on all API routes
- SQL injection prevention via Prisma ORM (parameterized queries)
- Environment variables for all secrets (never committed to source control)
