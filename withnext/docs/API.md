# API Reference — Empresa Plana Intranet

All endpoints live under `/intranet/` (NOT `/api/`).

## Conventions

| Item | Value |
|------|-------|
| **Envelope (success)** | `{ ok: true, data }` |
| **Envelope (error)** | `{ ok: false, error: { message } }` |
| **Auth** | Cookie `ep_session` — JWT HS256, httpOnly, sameSite lax, 7d expiry |
| **Rate limit** | Per-IP, in-memory |

---

## Auth

### `POST /intranet/auth/login`

Public. Rate limit: 10 req / 15 min.

**Body**

| Field | Type | Constraints |
|-------|------|-------------|
| `username` | string | 1–60 |
| `passkey` | string | 1–128 |

**Success** `200`

```json
{
  "ok": true,
  "data": {
    "user": { "id": 1, "username": "admin", "name": "Admin", "fullName": "Admin", "email": "admin@example.com", "role": "admin" }
  }
}
```

Sets `ep_session` cookie.

**Errors**

| Status | Message |
|--------|---------|
| 400 | `"Falten credencials"` |
| 401 | `"Credencials invàlides"` |
| 429 | `"Massa peticions, torna-ho a provar més tard"` |

---

### `POST /intranet/auth/register`

Public. Rate limit: 5 req / 1 h.

**Body**

| Field | Type | Constraints |
|-------|------|-------------|
| `username` | string | 3–60, regex `/^[a-z0-9._-]+$/i` |
| `email` | string | email, ≤ 200 |
| `password` | string | 8–128 |
| `name` | string | 1–60 |

**Success** `200`

```json
{
  "ok": true,
  "data": {
    "user": { "id": 10, "username": "newuser", "name": "New", "email": "new@example.com", "role": "client" }
  }
}
```

Sets `ep_session` cookie.

**Errors**

| Status | Message |
|--------|---------|
| 400 | Zod validation message or `"Dades invàlides"` |
| 409 | `"username_exists"` or `"email_exists"` |
| 429 | `"Massa peticions, torna-ho a provar més tard"` |

---

### `POST /intranet/auth/logout`

Public. No body.

**Success** `200` — `{ ok: true }` + clears `ep_session` cookie.

---

## Session

### `GET /intranet/me`

Requires session.

**Success** `200`

```json
{
  "ok": true,
  "data": { "user": { "id": 1, "username": "admin", "role": "admin" } }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |

---

### `GET /intranet/account`

Requires session.

**Success** `200`

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "name": "Admin",
      "fullName": "Admin",
      "email": "admin@example.com",
      "phone": "+34 600 000 000",
      "role": "admin",
      "totpEnabled": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |
| 404 | `"Usuari no trobat"` |

---

### `PATCH /intranet/account`

Requires session.

**Body** (all optional)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `name` | string | 1–60 | |
| `email` | string | email, ≤ 200 | Requires `currentPasskey` |
| `phone` | string | ≤ 30 | |
| `currentPasskey` | string | 1–128 | Required for email/password change |
| `newPassword` | string | 8–128 | Requires `currentPasskey` |

**Success** `200`

```json
{
  "ok": true,
  "data": { "user": { "id": 1, "username": "admin", "name": "Admin", "email": "admin@example.com", "phone": "", "role": "admin" } }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 400 | `"Dades invàlides"` |
| 400 | `"Cal indicar la contrasenya actual"` |
| 400 | `"Res a actualitzar"` |
| 401 | `"No autenticat"` |
| 403 | `"Contrasenya actual incorrecta"` |
| 404 | `"Usuari no trobat"` |
| 409 | `"email_exists"` |

---

## Client

### `GET /intranet/favorites`

Requires session.

**Success** `200`

```json
{
  "ok": true,
  "data": [
    { "id": 1, "routeId": "abc", "code": "R01", "name": "Route 1", "origin": "City A", "destination": "City B", "color": "#ff0000" }
  ]
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |

---

### `PUT /intranet/favorites`

Requires session. Toggle: creates if absent, deletes if exists.

**Body**

| Field | Type | Constraints |
|-------|------|-------------|
| `routeId` | string | ≥ 1 |

**Success** `200`

```json
{ "ok": true, "data": { "favorite": true } }
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |
| 400 | `"routeId requerit"` |
| 404 | `"Ruta no trobada"` |

---

### `GET /intranet/budgets`

Requires session. Returns only the authenticated user's budgets.

**Success** `200`

```json
{
  "ok": true,
  "data": [
    {
      "id": "uuid",
      "clientName": "Client",
      "reasonId": "transfer",
      "description": "...",
      "departureCity": "Barcelona",
      "departureDay": "2025-06-01",
      "departureTime": "08:00",
      "arrivalCity": "Madrid",
      "arrivalDay": "2025-06-01",
      "arrivalTime": "14:00",
      "people": "5",
      "status": "received",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |

---

### `POST /intranet/budget`

Public. Rate limit: 20 req / 1 min. Authenticated users get `userId` from session; anonymous users get a ghost user (upserted by email).

**Body**

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | string | 1–200 |
| `email` | string | email, ≤ 200 |
| `phone` | string | 1–30 |
| `company` | string | ≤ 200 (optional) |
| `reasonId` | string | ≤ 60 |
| `description` | string | ≤ 2000 (optional) |
| `departureCity` | string | ≤ 120 (optional) |
| `departureDay` | string | ≤ 12 (optional) |
| `departureTime` | string | ≤ 10 (optional) |
| `arrivalCity` | string | ≤ 120 (optional) |
| `arrivalDay` | string | ≤ 12 (optional) |
| `arrivalTime` | string | ≤ 10 (optional) |
| `people` | string | ≤ 10 (optional) |

**Success** `200`

```json
{ "ok": true, "data": { "id": "uuid", "status": "received" } }
```

**Errors**

| Status | Message |
|--------|---------|
| 400 | `"Dades invàlides"` |
| 429 | `"Massa peticions"` |

---

## Chat

All chat endpoints require `chat:access` capability.

### `GET /intranet/chat`

Requires `chat:access`. Staff (`chat:staff`) sees all `client-company` conversations. Clients see only conversations they participate in.

**Success** `200`

```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "type": "client-company",
      "clientUserId": 5,
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "lastMessage": { "body": "Hola", "senderRole": "client", "createdAt": "2025-01-01T00:00:00.000Z" }
    }
  ]
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |
| 403 | Capability denied |

---

### `POST /intranet/chat`

Requires `chat:access`. Auto-creates a `client-company` conversation if no `conversationId` is provided (requires `chat:create`; staff must always provide `conversationId`).

**Body**

| Field | Type | Constraints |
|-------|------|-------------|
| `conversationId` | int | optional |
| `body` | string | 1–2000 |

**Success** `200`

```json
{
  "ok": true,
  "data": { "id": 1, "conversationId": 1, "body": "Hola", "senderId": 1, "senderRole": "client", "createdAt": "2025-01-01T00:00:00.000Z" }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |
| 403 | `"Sense accés"` / capability denied |
| 400 | `"Missatge buit"` |
| 400 | `"El staff ha d'indicar la conversa"` |
| 404 | `"Conversa no trobada"` |

---

### `GET /intranet/chat/[id]`

Requires `chat:access` + participant or `chat:staff`.

**Path params**

| Param | Type |
|-------|------|
| `id` | int (positive) |

**Success** `200`

```json
{
  "ok": true,
  "data": {
    "id": 1,
    "type": "client-company",
    "messages": [
      { "id": 1, "body": "Hola", "senderId": 5, "senderRole": "client", "readAt": null, "createdAt": "2025-01-01T00:00:00.000Z" }
    ]
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | `"No autenticat"` |
| 400 | `"Id invàlid"` |
| 404 | `"Conversa no trobada"` |
| 403 | `"Sense accés"` |

---

## Fleet

All fleet endpoints require `fleet:view` capability.

### `GET /intranet/fleet/routes`

**Success** `200`

```json
{
  "ok": true,
  "data": [
    { "id": "abc", "code": "R01", "name": "Route 1", "origin": "Barcelona", "destination": "Madrid", "color": "#ff0000", "status": "active" }
  ]
}
```

Ordered by `code` ascending.

---

### `GET /intranet/fleet/summary`

**Success** `200`

```json
{ "ok": true, "data": { "routes": 10, "buses": 25, "stops": 50, "schedules": 100, "drivers": 30 } }
```

---

### `GET /intranet/fleet/notifications`

**Success** `200`

```json
{
  "ok": true,
  "data": [
    { "id": 1, "type": "delay", "title": "Retard R01", "desc": "30 min retard", "createdAt": "2025-01-01T00:00:00.000Z", "read": false, "routeId": "abc" }
  ]
}
```

Ordered by `createdAt` descending, take 50.

---

## Public

No authentication required.

### `GET /intranet/routes/search`

**Query params** (both required)

| Param | Type | Constraints |
|-------|------|-------------|
| `origin` | string | 1–120 |
| `destination` | string | 1–120 |

Case-insensitive substring match on active routes.

**Success** `200`

```json
{
  "ok": true,
  "data": [
    { "id": "abc", "code": "R01", "name": "Route 1", "origin": "Barcelona", "destination": "Madrid", "color": "#ff0000" }
  ]
}
```

**Errors**

| Status | Message |
|--------|---------|
| 400 | `"Origen i destinació requerits"` |

---

### `GET /intranet/offices`

**Success** `200`

```json
{
  "ok": true,
  "data": [
    { "id": 1, "name": "Seu Central", "address": "C/ Example 1", "city": "Barcelona", "postalCode": "08001", "phone": "+34 930 000 000", "purpose": "Oficina principal" }
  ]
}
```

Ordered by `order` ascending.

---

### `GET /intranet/health`

**Success** `200` — `{ ok: true, db: "up" }`

**Errors**

| Status | Body |
|--------|------|
| 503 | `{ ok: false, db: "down" }` |

---

## ACL Reference

Source: [`shared/acl.ts`](../shared/acl.ts)

| Role | Capabilities |
|------|-------------|
| **client** | `dashboard:access`, `profile:edit`, `chat:access`, `chat:create` |
| **worker** | + `chat:staff`, `fleet:view`, `budgets:view` |
| **admin** | All 12 capabilities |

Full capability list: `dashboard:access`, `profile:edit`, `chat:access`, `chat:create`, `chat:staff`, `fleet:view`, `fleet:manage`, `budgets:view`, `budgets:manage`, `content:manage`, `users:manage`, `system:manage`.

Authorization asks by capability, never by role directly.

---

## Demo Credentials

Source: `prisma/seed-data/seed.ts`

| Username | Password | Role |
|----------|----------|------|
| `cliente` | `12345678` | client |
| `trabajador` | `12345678` | worker |
| `admin` | `12345678` | admin |

---

## Examples

```bash
# Login
curl -X POST http://localhost:3000/intranet/auth/login \
  -H 'Content-Type: application/json' \
  -c cookies.txt \
  -d '{"username":"admin","passkey":"12345678"}'

# Get current user
curl http://localhost:3000/intranet/me -b cookies.txt

# Get fleet routes (admin has fleet:view)
curl http://localhost:3000/intranet/fleet/routes -b cookies.txt

# Search public routes
curl "http://localhost:3000/intranet/routes/search?origin=Barcelona&destination=Madrid"

# Submit budget (anonymous)
curl -X POST http://localhost:3000/intranet/budget \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","phone":"600000000","reasonId":"transfer"}'

# Toggle favorite
curl -X PUT http://localhost:3000/intranet/favorites \
  -H 'Content-Type: application/json' \
  -b cookies.txt \
  -d '{"routeId":"abc123"}'
```
