// 消息类型枚举 - 包含原有类型和新增类型
export type MessageType =
  | "todo"
  | "announcement"
  | "assignedToMe"
  | "internalMessage"
  | "myAssigned"
  | "system"
  | "alarm"
  | "order"
  | "maintenance"
  | "notice";

// 消息状态：0-未读，1-已读，2-已处理
export type MessageStatus = 0 | 1 | 2;

// 消息优先级：1-低，2-普通，3-高，4-紧急
export type MessagePriority = 1 | 2 | 3 | 4;

// 消息项接口
export interface MessageItem {
  id: string;
  title: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  priority: MessagePriority;
  createTime: string;
  sender?: string;
  receiver?: string;
  actionUrl?: string;
}

// 消息统计接口
export interface MessageCount {
  type: MessageType;
  label: string;
  count: number;
  badgeValue?: string | number;
  badgeType?: "primary" | "success" | "warning" | "danger" | "info";
  badgeColor?: string;
}

// API响应接口
export interface MessageListResponse {
  list: MessageItem[];
  total: number;
}
