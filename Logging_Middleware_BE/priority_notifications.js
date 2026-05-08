class Notification {
  constructor(id, type, message, createdAt) {
    this.id = id;
    this.type = type;
    this.message = message;
    this.createdAt = createdAt;
  }
}
const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};
function calculatePriority(notification) {
  const now = Date.now();
  const created =
    new Date(notification.createdAt).getTime();
  const hoursAgo =
    (now - created) / (1000 * 60 * 60);
  const recencyScore = Math.max(
    0,
    24 - hoursAgo
  );
  return (
    weights[notification.type] + recencyScore
  );
}
function getTopNotifications(
  notifications,
  topK = 10
) {
  return notifications
    .map((n) => ({
      ...n,
      priority: calculatePriority(n),
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, topK);
}
const notifications = [
  new Notification(
    1,
    "Placement",
    "Google interview tomorrow",
    "2026-05-08T09:00:00"
  ),
  new Notification(
    2,
    "Result",
    "Semester results published",
    "2026-05-07T10:00:00"
  ),
  new Notification(
    3,
    "Event",
    "Hackathon starts tonight",
    "2026-05-08T06:00:00"
  ),
];
const topNotifications =
  getTopNotifications(notifications);
console.log(topNotifications);