# Security Specification

## 1. Data Invariants
- Each user profile `/users/{userId}` is strictly owned by `request.auth.uid == userId`.
- Workout sessions `/users/{userId}/workouts/{workoutId}` can only be created, read, updated, or deleted by the document owner (`request.auth.uid == userId`).
- Sub-collection writes must enforce that `incoming().userId == request.auth.uid`.
- Document IDs must conform to regex `^[a-zA-Z0-9_\-]+$` and have a maximum size of 128 characters.
- String fields must have length constraints to prevent Denial-of-Wallet payload bloat attacks.
- Non-authenticated requests (`request.auth == null`) are strictly rejected.
- Blanket reads and unbounded query scrapes are blocked.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Profile Read**: Reading `/users/user123` with `request.auth == null` -> PERMISSION_DENIED.
2. **Impersonated Profile Write**: User A writing to `/users/userB` -> PERMISSION_DENIED.
3. **Id Poisoning Attack**: Attempting to write document with 2KB id string -> PERMISSION_DENIED.
4. **UID Field Tampering**: User A writing `uid: "victim123"` in their profile payload -> PERMISSION_DENIED.
5. **Malicious Subcollection Write**: User A injecting a workout record into `/users/userB/workouts/w1` -> PERMISSION_DENIED.
6. **Payload Bloat Attack**: Writing a user profile with a 50KB name string -> PERMISSION_DENIED.
7. **Foreign UserId in Workout**: User A creating workout in `/users/userA/workouts/w1` with `userId: "userB"` -> PERMISSION_DENIED.
8. **Catch-All Wildcard Exploit**: Accessing an unmapped path `/system_configs/master` -> PERMISSION_DENIED.
9. **Blanket Query Scraping**: Running an unrestricted query on `/users` collection without scoping to owner UID -> PERMISSION_DENIED.
10. **Gamification State Spoofing**: User A modifying `/users/userB/gamification/state` -> PERMISSION_DENIED.
11. **Negative Duration Exploit**: Sending negative durationSeconds in workout record -> PERMISSION_DENIED.
12. **Unauthenticated Write**: Creating a workout document without active auth token -> PERMISSION_DENIED.
