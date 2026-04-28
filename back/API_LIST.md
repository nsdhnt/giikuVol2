# API List

Base URL example:

```text
http://localhost:8000
```

## Users

### Signup

```text
POST /signup
```

Current implementation receives `email` and `password` as query parameters.

Request example:

```text
POST http://localhost:8000/signup?email=test@example.com&password=password123
```

Response example:

```json
{
  "id": "generated-user-id",
  "email": "test@example.com",
  "password": "password123",
  "subscribe": null
}
```

### Login

```text
POST /login
```

Current implementation receives `email` and `password` as query parameters.

Request example:

```text
POST http://localhost:8000/login?email=test@example.com&password=password123
```

Success response:

```json
{
  "message": "ok"
}
```

Failure response:

```json
{
  "error": "invalid"
}
```

### Update Subscribe

```text
PUT /{user_id}/subscribe
```

Request body:

```json
{
  "subscribe": "on"
}
```

Response example:

```json
{
  "message": "ok",
  "subscribe": "on"
}
```

User not found response:

```json
{
  "error": "user not found"
}
```

## Settings

### Create Or Update Settings

```text
POST /settings
```

Saves the user's quiz topic and interval in minutes. If the same `user_id` already exists, `topic` and `time` are updated.

Request body:

```json
{
  "user_id": "user001",
  "topic": "food",
  "time": 10
}
```

Response example:

```json
{
  "user_id": "user001",
  "topic": "food",
  "time": 10,
  "created_at": "2026-04-28T12:34:56.789000"
}
```

### Get Settings

```text
GET /settings/{user_id}
```

Request example:

```text
GET http://localhost:8000/settings/user001
```

Response example:

```json
{
  "topic": "food",
  "time": 10
}
```

Not found response:

```json
{
  "message": "not found"
}
```

## Issues

### Start Issue

```text
POST /issues/start
```

Creates or returns a quiz issue for the user.

Behavior:

- Reads `topic` and `time` from the `settings` table by `user_id`.
- If the latest issue was created less than `time` minutes ago, returns the latest issue.
- If `time` minutes or more have passed, generates a new AI word quiz based on `topic`.
- If settings do not exist for the user, returns HTTP 404.

Request body:

```json
{
  "user_id": "user001"
}
```

Response example:

```json
{
  "id": "generated-issue-id",
  "user_id": "user001",
  "issue": "料理で使う、りんごを英語で何と言いますか？",
  "answer": "",
  "judgment": "",
  "created_at": "2026-04-28T12:34:56.789000"
}
```

Settings not found response:

```json
{
  "detail": "settings not found"
}
```

### Submit Answer

```text
POST /issues/{id}/answer
```

Submits an answer for an issue and saves the AI judgment.

Request body:

```json
{
  "answer": "apple"
}
```

Response example:

```json
{
  "id": "generated-issue-id",
  "user_id": "user001",
  "issue": "料理で使う、りんごを英語で何と言いますか？",
  "answer": "apple",
  "judgment": "正解",
  "created_at": "2026-04-28T12:34:56.789000"
}
```

Empty answer response:

```json
{
  "detail": "answer is required"
}
```

Issue not found response:

```json
{
  "detail": "issue not found"
}
```

## Recommended Test Flow

1. `POST /signup?email=test@example.com&password=password123`
2. Copy the returned user `id`.
3. `POST /settings` with the copied `user_id`, a `topic`, and `time`.
4. `POST /issues/start` with the same `user_id`.
5. Copy the returned issue `id`.
6. `POST /issues/{id}/answer`.
