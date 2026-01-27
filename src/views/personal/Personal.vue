<template>
  <!-- 个人中心 -->
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card>
        <el-descriptions direction="vertical" border style="margin-top: 10px">
          <el-descriptions-item
            :rowspan="2"
            :width="140"
            label="个人头像"
            align="center"
          >
            <el-image
              style="width: 100px; height: 100px"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </el-descriptions-item>
          <el-descriptions-item label="姓名">小林</el-descriptions-item>
          <el-descriptions-item label="电话">18100000000</el-descriptions-item>
          <el-descriptions-item label="部门 / 工号"
            >技术部 / 2766</el-descriptions-item
          >
          <el-descriptions-item label="邮箱"
            >xiaolin@greenflash.com</el-descriptions-item
          >
          <el-descriptions-item label="个人标签">
            <el-tag type="danger" class="mr" effect="dark">疯狂敲码中</el-tag>
            <el-tag type="success" class="mr" effect="dark">代码强迫症</el-tag>
            <el-tag type="warning" class="mr" effect="dark">工作狂</el-tag>
            <el-tag type="primary" class="mr" effect="dark">热情开朗</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="mt">
        <el-calendar v-model="value" />
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <span>修改 / 完善个人资料</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="16">
            <StepForm
              :steps="steps"
              :form1="form1"
              :form2="form2"
              @handle-submit="handleSubmit"
            >
              <template #step-1>
                <el-form
                  :model="formData.basicInfo"
                  ref="form1"
                  :rules="basicRules"
                >
                  <el-form-item label="姓名：" prop="name">
                    <el-input v-model="formData.basicInfo.name" />
                  </el-form-item>
                  <el-form-item label="电话：" prop="tel">
                    <el-input v-model="formData.basicInfo.tel" />
                  </el-form-item>
                  <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="formData.basicInfo.email" />
                  </el-form-item>
                </el-form>
              </template>
              <template #step-2>
                <el-form
                  :model="formData.jobInfo"
                  ref="form2"
                  :rules="jobRules"
                >
                  <el-form-item label="在职状态:">
                    <el-select
                      placeholder="请选择在职状态"
                      v-model="formData.jobInfo.status"
                    >
                      <el-option label="工作中" value="1"></el-option>
                      <el-option label="请假中" value="2"></el-option>
                      <el-option label="出差中" value="3"></el-option>
                      <el-option label="年假中" value="4"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="部门：" prop="department">
                    <el-select
                      placeholder="请选择您的部门"
                      v-model="formData.jobInfo.department"
                    >
                      <el-option label="总经办" value="1"></el-option>
                      <el-option label="运营部" value="2"></el-option>
                      <el-option label="技术部" value="3"></el-option>
                      <el-option label="市场部" value="4"></el-option>
                      <el-option label="财务部" value="5"></el-option>
                      <el-option label="维修部" value="6"></el-option>
                      <el-option label="客服部" value="7"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="工号：" prop="employeeID">
                    <el-input v-model="formData.jobInfo.employeeID" />
                  </el-form-item>
                </el-form>
              </template>
            </StepForm>
          </el-col>
          <el-col :span="8">
            <div
              style="
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: space-around;
              "
            >
              <h3 style="margin-bottom: 40px; font-weight: 400">资料完善度</h3>
              <el-progress type="circle" :percentage="85" />
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <el-badge
          v-for="count in messageCounts"
          :key="count.type"
          :value="count.badgeValue"
          :type="count.badgeType"
          :color="count.badgeColor"
          class="mr"
        >
          <el-button
            @click="handleMessageTypeClick(count.type as MessageType)"
            :type="currentMessageType === count.type ? 'primary' : 'default'"
          >
            {{ count.label }}
          </el-button>
        </el-badge>
      </el-card>
      <el-card class="mt" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span>
              {{
                currentMessageType
                  ? messageCounts.find((c) => c.type === currentMessageType)
                      ?.label
                  : "全部消息"
              }}
              ({{ messageList.length }})
            </span>
          </div>
        </template>

        <el-empty v-if="messageList.length === 0" description="暂无消息" />

        <el-collapse v-else>
          <el-collapse-item
            v-for="message in messageList"
            :key="message.id"
            :name="message.id"
          >
            <template #title>
              <div class="message-title">
                <span
                  class="priority-indicator"
                  :style="{
                    backgroundColor: getPriorityColor(message.priority),
                  }"
                ></span>
                <span class="title-text">{{ message.title }}</span>
                <el-tag
                  v-if="message.status === 0"
                  type="danger"
                  size="small"
                  class="ml-2"
                >
                  未读
                </el-tag>
                <el-tag
                  v-else-if="message.status === 1"
                  type="success"
                  size="small"
                  class="ml-2"
                >
                  已读
                </el-tag>
                <el-tag v-else type="info" size="small" class="ml-2">
                  已处理
                </el-tag>
              </div>
            </template>

            <div class="message-content">
              <div class="content-text">{{ message.content }}</div>
              <div class="message-meta">
                <span class="meta-item">
                  <el-icon><Clock /></el-icon>
                  {{ message.createTime }}
                </span>
                <span v-if="message.sender" class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ message.sender }}
                </span>
                <span v-if="message.receiver" class="meta-item">
                  <el-icon><UserFilled /></el-icon>
                  发送给: {{ message.receiver }}
                </span>
              </div>
              <div class="message-actions">
                <el-button
                  v-if="message.status !== 2 && message.actionUrl"
                  type="primary"
                  size="small"
                  @click="handleProcessMessage(message.id)"
                  v-permission="'user'"
                >
                  去处理
                </el-button>
                <el-button
                  v-else-if="message.status !== 2"
                  type="primary"
                  size="small"
                  @click="handleProcessMessage(message.id)"
                >
                  标记已处理
                </el-button>
                <el-tag v-else type="success" size="small"> 已处理完成 </el-tag>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import StepForm from "@/components/stepForm/StepForm.vue";
import "dayjs/locale/zh-cn"; // 日期和时间本地化 日历组件的
// Element Plus提供的表单实例类型
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import {
  getMessageListApi,
  getMessageCountsApi,
  processMessageApi,
} from "@/api/message";
import type { MessageItem, MessageCount, MessageType } from "@/types/message";

const value = ref(new Date());

// 消息相关数据
const messageCounts = ref<MessageCount[]>([]);
const messageList = ref<MessageItem[]>([]);
const currentMessageType = ref<MessageType | null>(null);
const loading = ref(false);

// 获取消息统计
const loadMessageCounts = async () => {
  try {
    const res = await getMessageCountsApi();
    if (res.code === 200) {
      messageCounts.value = res.data;
    }
  } catch (error) {
    console.error("获取消息统计失败:", error);
  }
};

// 获取消息列表
const loadMessageList = async (type?: MessageType) => {
  try {
    loading.value = true;
    const res = await getMessageListApi(type);
    if (res.code === 200) {
      messageList.value = res.data.list;
    }
  } catch (error) {
    console.error("获取消息列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理消息按钮点击
const handleMessageTypeClick = async (type: MessageType) => {
  currentMessageType.value = type;
  await loadMessageList(type);
};

// 处理消息操作
const handleProcessMessage = async (messageId: string) => {
  try {
    const res = await processMessageApi(messageId);
    if (res.code === 200) {
      ElMessage.success("处理成功");
      // 重新加载消息列表和统计
      await loadMessageList(currentMessageType.value || undefined);
      await loadMessageCounts();
    }
  } catch (error) {
    console.error("处理消息失败:", error);
    ElMessage.error("处理失败，请重试");
  }
};

// 获取消息优先级颜色
const getPriorityColor = (priority: number) => {
  const colors = {
    1: "#909399", // 低优先级 - 灰色
    2: "#409EFF", // 普通 - 蓝色
    3: "#E6A23C", // 高优先级 - 橙色
    4: "#F56C6C", // 紧急 - 红色
  };
  return colors[priority as keyof typeof colors] || colors[2];
};

// 页面加载时获取数据
onMounted(async () => {
  await loadMessageCounts();
  await loadMessageList(); // 默认加载所有消息
});

// 这里可以ref也可以不用ref 因为这里不需要响应式
const steps = [{ title: "基本信息" }, { title: "在职信息" }];

const formData = ref({
  // 基本信息
  basicInfo: {
    name: "",
    tel: "",
    email: "",
  },
  // 在职信息
  jobInfo: {
    status: "", // 在职状态
    department: "", // 部门
    employeeID: "", // 工号
  },
});

// 这里如果设置了规则的话，上面的el-form-item就要设置prop属性 el-form就要设置规则
// 如果不设置规则这一步 上面也不用加prop了
const basicRules = {
  name: [{ required: true, message: "请输入您的姓名", trigger: "blur" }],
  tel: [{ required: true, message: "请输入您的电话", trigger: "blur" }],
  email: [{ required: true, message: "请输入您的邮箱", trigger: "blur" }],
};
// 在职状态没有设置规则 所以上面不设置prop属性
const jobRules = {
  department: [{ required: true, message: "请选择您的部门", trigger: "blur" }],
  employeeID: [{ required: true, message: "请输入您的工号", trigger: "blur" }],
};

// 定义完下面的后 要给StepForm传上去 :form1="form1"
const form1 = ref<FormInstance>();
const form2 = ref<FormInstance>();

// 在StepForm组件中已经定义好该自定义事件名了
// 提交表单数据
const handleSubmit = () => {
  console.log("表单数据", formData.value);
  // 后面的步骤可以后续补充 调接口
};
</script>
<style scoped>
.message-title {
  display: flex;
  align-items: center;
  width: 100%;
}

.priority-indicator {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  margin-right: 8px;
  flex-shrink: 0;
}

.title-text {
  flex: 1;
  font-weight: 500;
}

.message-content {
  padding: 8px 0;
}

.content-text {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #606266;
  font-size: 14px;
}

.message-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #909399;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.ml-2 {
  margin-left: 8px;
}

.mr {
  margin-right: 12px;
}

.mt {
  margin-top: 16px;
}
</style>
