import { get, post } from "@/utils/http";
import type { MessageType } from "@/types/message";

const Api = {
  MessageList: "/messageList",
  MessageCounts: "/messageCounts",
  MarkAsRead: "/markAsRead",
  ProcessMessage: "/processMessage",
};

// 获取消息列表
function getMessageListApi(type?: MessageType) {
  return post(Api.MessageList, { type });
}

// 获取消息统计
function getMessageCountsApi() {
  return get(Api.MessageCounts);
}

// 标记消息为已读
function markAsReadApi(messageId: string) {
  return post(Api.MarkAsRead, { messageId });
}

// 处理消息
function processMessageApi(messageId: string) {
  return post(Api.ProcessMessage, { messageId });
}

export {
  getMessageListApi,
  getMessageCountsApi,
  markAsReadApi,
  processMessageApi,
};
