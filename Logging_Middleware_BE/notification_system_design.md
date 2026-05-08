# Notification System Design

---

# Stage 1 — REST API Design

## Objective

Design a scalable notification system that supports:
- real-time notifications
- unread notification tracking
- filtering
- priority handling
- large-scale concurrent users

---

## API Endpoints

### 1. Get Notifications

### Endpoint
```http
GET /notifications
```

### Query Parameters
| Parameter | Description |
|---|---|
| page | pagination page |
| limit | notifications per page |
| unreadOnly | fetch unread notifications only |

### Sample Request
```http
GET /notifications?page=1&limit=10&unreadOnly=true
```

### Sample Response
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "Placement",
      "message": "Google interview tomorrow",
      "isRead": false,
      "createdAt": "2026-05-08T10:00:00Z"
    }
  ]
}
```

---

### 2. Create Notification

### Endpoint
```http
POST /notifications
```

### Request Body
```json
{
  "userId": 101,
  "type": "Result",
  "message": "Semester results published"
}
```

### Response
```json
{
  "success": true,
  "notificationId": 55
}
```

---

### 3. Mark Notification as Read

### Endpoint
```http
PATCH /notifications/:id/read
```

### Response
```json
{
  "success": true
}
```

---

### 4. Delete Notification

### Endpoint
```http
DELETE /notifications/:id
```

### Response
```json
{
  "success": true
}
```

---

## Real-Time Notification Delivery

To support real-time updates:
- WebSockets can be used for persistent bidirectional communication
- Server-Sent Events (SSE) can be used for lightweight live updates

### WebSocket Flow
Client → WebSocket Connection → Notification Server → Push Event

Benefits:
- low latency
- instant updates
- efficient communication

---

# Stage 2 — Database Design

## Database Choice

I would use PostgreSQL because:
- ACID compliance
- strong indexing support
- transactional consistency
- reliability at scale
- efficient querying

---

## Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(20),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Additional Indexes

```sql
CREATE INDEX idx_user_notifications
ON notifications(user_id);
```

---

## Scalability Strategies

### 1. Table Partitioning
Partition notifications by:
- month
- year
- user ranges

This improves:
- query speed
- archival efficiency

---

### 2. Read Replicas

Use PostgreSQL read replicas for:
- scaling reads
- handling large traffic

---

# Stage 3 — Query Optimization

## Problem

When millions of notifications are stored, fetching unread notifications becomes slow.

Example query:

```sql
SELECT *
FROM notifications
WHERE user_id = 101
AND is_read = false
ORDER BY created_at DESC;
```

Without indexes, PostgreSQL performs:
- full table scans
- high disk usage
- slow sorting

---

## Solution — Composite Index

```sql
CREATE INDEX idx_notifications
ON notifications(user_id, is_read, created_at DESC);
```

---

## Why Composite Index Helps

This index improves:
- filtering speed
- sorting speed
- unread notification lookup

Complexity improves significantly because the database can directly locate matching rows.

---

## Why Not Index Every Column

Indexing every column is bad because:
- inserts become slower
- updates become expensive
- indexes consume storage
- maintenance overhead increases

Indexes should only be added for frequent query patterns.

---

# Stage 4 — Scaling the Notification System

## Redis Caching

Redis can cache:
- recent notifications
- unread counts
- frequently accessed data

Benefits:
- reduced database load
- lower latency
- faster API responses

---

## Pagination

Instead of loading all notifications:

```http
GET /notifications?page=1&limit=10
```

Pagination:
- reduces memory usage
- improves frontend performance
- prevents large payloads

---

## Infinite Scrolling

Frontend loads notifications incrementally as users scroll.

Benefits:
- better UX
- reduced initial loading time

---

## WebSocket Push Notifications

Use WebSockets to:
- instantly push new notifications
- avoid repeated polling

---

# Stage 5 — Reliable Notification Delivery

## Architecture

```text
Client → API Server → Queue → Worker → Email/SMS/Push Service
```

---

## Why Queues Are Important

Queues help:
- handle traffic spikes
- process tasks asynchronously
- improve reliability

---

## Recommended Queue Systems

- RabbitMQ
- Apache Kafka

---

## Worker Services

Worker services process notifications independently.

Responsibilities:
- send emails
- send SMS
- send push notifications

---

## Retry Mechanism

If notification delivery fails:
- retry automatically
- exponential backoff can be applied

---

## Dead Letter Queue (DLQ)

Failed notifications after multiple retries are stored in DLQ.

Benefits:
- prevents message loss
- allows debugging
- supports recovery workflows

---

# Stage 6 — Priority Notification Ranking

## Objective

Display the most important notifications first.

Priority weights:
| Type | Weight |
|---|---|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

Final priority score:
```text
priorityScore = weight + recencyScore
```

Recent notifications receive higher scores.

---

## Optimization Strategy

Instead of sorting all notifications repeatedly:
- maintain only top K notifications
- use efficient priority ranking

---

## Data Structure Choice

A Min Heap can efficiently maintain:
- top 10 notifications
- low memory usage
- faster updates

Time Complexity:
- O(n log k)

Where:
- n = total notifications
- k = top notifications displayed

---

## Benefits

This approach:
- scales efficiently
- reduces sorting overhead
- supports real-time ranking

---

# Conclusion

The proposed notification system supports:
- scalable APIs
- efficient querying
- real-time communication
- reliable delivery
- optimized notification ranking

The architecture is designed for:
- maintainability
- scalability
- performance
- fault tolerance