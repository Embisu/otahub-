-- Nhật ký hoạt động admin và phiên đăng nhập chuyển từ KV sang D1 (giảm lượt ghi KV).
-- worker/lib.js cũng tự tạo hai bảng này bằng CREATE TABLE IF NOT EXISTS nếu chưa có.

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  action TEXT NOT NULL,
  username TEXT,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  sid TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
