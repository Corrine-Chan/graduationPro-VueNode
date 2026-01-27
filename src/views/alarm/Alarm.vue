<template>
  <!-- 报警管理 -->
  <el-card>
    <el-radio-group
      v-model="radio1"
      size="large"
      fill="#6c6cff"
      @change="handleLevelChange"
    >
      <el-radio-button label="严重告警" :value="1"></el-radio-button>
      <el-radio-button label="紧急告警" :value="2"></el-radio-button>
      <el-radio-button label="重要告警" :value="3"></el-radio-button>
      <el-radio-button label="一般告警" :value="4"></el-radio-button>
    </el-radio-group>
  </el-card>

  <!-- 显示当前筛选的告警级别统计 -->
  <el-card class="mt">
    <el-statistic
      :title="`当前${getLevelText(radio1)}数量`"
      :value="filteredAlarmList.length"
      suffix="条"
    />
  </el-card>

  <el-card class="mt" v-for="item in filteredAlarmList" :key="item.equNo">
    <el-alert
      :title="`${item.address}充电站充电异常`"
      :type="getAlertType(item.level)"
      show-icon
    />
    <el-descriptions :border="true" :column="4" direction="vertical" class="mt">
      <el-descriptions-item v-for="(val, key) in item" :label="getLabel(key)">
        <el-tag v-if="key === 'level'" :type="getLevelTagType(val as number)">
          {{ getLevelText(val as number) }}
        </el-tag>
        <el-text
          v-else-if="key === 'status'"
          :type="getStatusTextType(val as number)"
        >
          {{ getStatusText(val as number) }}
        </el-text>
        <span v-else>{{ val }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          @click="handleAction(item)"
          :type="getActionButtonType(item.status)"
        >
          {{ getActionButtonText(item.status) }}
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>

  <!-- 如果没有对应级别的告警 -->
  <el-card class="mt" v-if="filteredAlarmList.length === 0">
    <el-empty description="暂无对应级别的告警信息" />
  </el-card>

  <el-drawer v-model="drawer" :title="drawerTitle" size="40%">
    <!-- 显示选中告警的详细信息 -->
    <div v-if="selectedAlarm">
      <el-descriptions title="告警详细信息" :column="2" border>
        <el-descriptions-item label="故障描述">
          <el-text size="large" :type="getLevelTagType(selectedAlarm.level)">
            {{ selectedAlarm.description }}
          </el-text>
        </el-descriptions-item>
        <el-descriptions-item label="设备地址">{{
          selectedAlarm.address
        }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">
          <el-tag>{{ selectedAlarm.equNo }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="告警级别">
          <el-tag :type="getLevelTagType(selectedAlarm.level)">
            {{ getLevelText(selectedAlarm.level) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="故障时间">{{
          selectedAlarm.time
        }}</el-descriptions-item>
        <el-descriptions-item label="故障代码">
          <el-tag type="info">{{ selectedAlarm.code }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <el-text :type="getStatusTextType(selectedAlarm.status)">
            {{ getStatusText(selectedAlarm.status) }}
          </el-text>
        </el-descriptions-item>
        <el-descriptions-item label="处理建议">
          <el-text>{{ getProcessingSuggestion(selectedAlarm) }}</el-text>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 根据状态显示不同的操作界面 -->
    <div class="mt" v-if="selectedAlarm">
      <!-- 待指派状态显示指派表单 -->
      <div v-if="selectedAlarm.status === 1">
        <StepForm
          :steps="steps"
          :form1="form1"
          :form2="form2"
          :form3="form3"
          @handle-submit="handleSubmit"
        >
          <!-- 将这部分模板片段传入组件的step-1插槽中 -->
          <template #step-1>
            <el-form
              :model="formData.basicInfo"
              :rules="basicRules"
              ref="form1"
            >
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="formData.basicInfo.name" />
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="formData.basicInfo.email" />
              </el-form-item>
              <el-form-item label="电话：" prop="tel">
                <el-input v-model="formData.basicInfo.tel" />
              </el-form-item>
              <el-form-item label="工号：" prop="no">
                <el-input v-model="formData.basicInfo.no" />
              </el-form-item>
              <el-form-item label="是否加急">
                <el-switch v-model="formData.basicInfo.urgent"></el-switch>
              </el-form-item>
              <el-form-item label="其他选项">
                <el-checkbox-group v-model="formData.basicInfo.other">
                  <el-checkbox value="1">更换设备</el-checkbox>
                  <el-checkbox value="2">仅维修</el-checkbox>
                  <el-checkbox value="3">需拍照片</el-checkbox>
                  <el-checkbox value="4">需报备</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="其他备注信息：">
                <el-input
                  v-model="formData.basicInfo.remarks"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
          </template>
          <template #step-2>
            <el-form
              :model="formData.approvalInfo"
              :rules="approvalRules"
              ref="form2"
            >
              <el-form-item label="审批部门" prop="approvalDepartment">
                <el-select
                  placeholder="请选择审批部门"
                  v-model="formData.approvalInfo.approvalDepartment"
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
              <el-form-item label="抄送部门" prop="ccDepartment">
                <el-select
                  placeholder="请选择抄送部门"
                  v-model="formData.approvalInfo.ccDepartment"
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
            </el-form>
          </template>
          <template #step-3>
            <el-form
              :model="formData.personInfo"
              :rules="personRules"
              ref="form3"
            >
              <el-form-item label="负责人姓名：" prop="person">
                <el-input v-model="formData.personInfo.person" />
              </el-form-item>
              <el-form-item label="负责人电话：" prop="tel">
                <el-input v-model="formData.personInfo.tel" />
              </el-form-item>
            </el-form>
          </template>
        </StepForm>
      </div>

      <!-- 处理中状态显示催办信息 -->
      <div v-else-if="selectedAlarm.status === 2">
        <el-result
          icon="warning"
          :title="`设备编号：${selectedAlarm.equNo}`"
          sub-title="该任务已催促2次，请及时处理"
        >
          <template #extra>
            <el-button type="primary" @click="drawer = false"
              >我已知晓</el-button
            >
          </template>
        </el-result>
      </div>

      <!-- 处理异常状态显示异常信息 -->
      <div v-else-if="selectedAlarm.status === 3">
        <el-result
          icon="error"
          :title="`设备编号：${selectedAlarm.equNo}`"
          sub-title="处理过程中出现异常，需要重新分配处理人员"
        >
          <template #extra>
            <el-button type="danger" @click="handleReassign"
              >重新分配</el-button
            >
            <el-button @click="drawer = false">关闭</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { alarmListApi } from "@/api/alarm";
import { getLabel } from "./fieldLabelMap";
import StepForm from "@/components/stepForm/StepForm.vue";
// Element Plus提供的表单实例类型
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

interface AlarmListType {
  description: string;
  address: string;
  equNo: string;
  level: number; //1严重 2紧急 3重要 4一般
  time: string;
  code: number; //故障代码
  status: number; //1待指派 2处理中 3处理异常
}

const radio1 = ref<number>(1);
const selectedAlarm = ref<AlarmListType | null>(null);

// 把数据存起来
const alarmList = ref<AlarmListType[]>([]);

// 根据选中的告警级别筛选数据
const filteredAlarmList = computed(() => {
  return alarmList.value.filter((item) => item.level === radio1.value);
});

// 动态抽屉标题
const drawerTitle = computed(() => {
  if (!selectedAlarm.value) return "告警详情";

  const statusText = getStatusText(selectedAlarm.value.status);
  const levelText = getLevelText(selectedAlarm.value.level);
  return `${levelText} - ${statusText}`;
});

onMounted(async () => {
  // res 里面有data 把其解构赋值出来
  const { data } = await alarmListApi();
  //   console.log(res); // 打印出来数据
  alarmList.value = data;
});

const drawer = ref<boolean>(false);

// 处理告警级别切换
const handleLevelChange = (level: number) => {
  console.log(`切换到${getLevelText(level)}`);
};

// 处理操作按钮点击
const handleAction = (alarm: AlarmListType) => {
  selectedAlarm.value = alarm;
  drawer.value = true;
};

// 重新分配处理
const handleReassign = () => {
  ElMessage.success("已重新分配处理人员");
  drawer.value = false;
};

// 获取告警级别文本
const getLevelText = (level: number): string => {
  const levelMap: Record<number, string> = {
    1: "严重告警",
    2: "紧急告警",
    3: "重要告警",
    4: "一般告警",
  };
  return levelMap[level] || "未知";
};

// 获取告警级别标签类型
const getLevelTagType = (level: number): string => {
  const typeMap: Record<number, string> = {
    1: "danger",
    2: "warning",
    3: "primary",
    4: "info",
  };
  return typeMap[level] || "info";
};

// 获取Alert组件类型
const getAlertType = (level: number): string => {
  const typeMap: Record<number, string> = {
    1: "error",
    2: "warning",
    3: "info",
    4: "success",
  };
  return typeMap[level] || "info";
};

// 获取状态文本
const getStatusText = (status: number): string => {
  const statusMap: Record<number, string> = {
    1: "待指派",
    2: "处理中",
    3: "处理异常",
  };
  return statusMap[status] || "未知";
};

// 获取状态文本类型
const getStatusTextType = (status: number): string => {
  const typeMap: Record<number, string> = {
    1: "warning",
    2: "primary",
    3: "danger",
  };
  return typeMap[status] || "info";
};

// 获取操作按钮类型
const getActionButtonType = (status: number): string => {
  const typeMap: Record<number, string> = {
    1: "primary",
    2: "warning",
    3: "danger",
  };
  return typeMap[status] || "primary";
};

// 获取操作按钮文本
const getActionButtonText = (status: number): string => {
  const textMap: Record<number, string> = {
    1: "指派",
    2: "催办",
    3: "查看",
  };
  return textMap[status] || "操作";
};

// 获取处理建议
const getProcessingSuggestion = (alarm: AlarmListType): string => {
  const suggestions: Record<string, string> = {
    充电枪拿不下来: "检查充电枪锁止机构，必要时手动释放",
    电动车无法充电: "检查充电接口连接，确认车辆充电系统正常",
    充电结束未通知: "检查通信模块，重启设备通信系统",
    设备显示屏故障: "检查显示屏连接线路，必要时更换显示模块",
    无法启动充电: "检查电源供应和控制系统，确认安全检测正常",
    充电枪接触不良: "清洁充电接口，检查接触片磨损情况",
    设备漏电报警: "立即断电检查，排查绝缘故障点",
    充电功率异常: "检查功率模块和散热系统",
    网络连接中断: "检查网络设备和通信线路",
    温度传感器故障: "更换温度传感器，校准温度监测系统",
    支付系统异常: "重启支付模块，检查网络连接",
    设备过热保护: "检查散热系统，清理散热器灰尘",
  };
  return suggestions[alarm.description] || "请联系技术人员进行详细检查";
};

// 这里可以不用加ref 因为是直接用后面不会改的
const steps = [
  { title: "基本信息" },
  { title: "审批信息" },
  { title: "负责人信息" }, // 后面可以继续新增步骤
];

// 抽屉组件表单数据对象 里面有几个表单的数据
const formData = ref({
  // 基本信息
  basicInfo: {
    name: "",
    email: "",
    tel: "",
    no: "",
    urgent: true,
    other: [],
    remarks: "",
  },
  // 审批信息
  approvalInfo: {
    approvalDepartment: "", // 审批部门
    ccDepartment: "", // 抄送部门
  },
  // 负责人信息
  personInfo: {
    person: "", // 负责人姓名
    tel: "", // 负责人电话
  },
});

// 直接给对象 因为后面不会去改它的了
// 得在上面表单组件那里加上对应的prop属性 因为prop属性决定的是它验证的那个规则
const basicRules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  tel: [{ required: true, message: "请输入电话", trigger: "blur" }],
  no: [{ required: true, message: "请输入工号", trigger: "blur" }],
};

const approvalRules = {
  approvalDepartment: [
    { required: true, message: "审批部门不能为空", trigger: "blur" },
  ],
  ccDepartment: [
    { required: true, message: "抄送部门不能为空", trigger: "blur" },
  ],
};

const personRules = {
  person: [{ required: true, message: "负责人姓名不能为空", trigger: "blur" }],
  tel: [{ required: true, message: "负责人电话不能为空", trigger: "blur" }],
};

// 此时的form1就是这个表单对象
const form1 = ref<FormInstance>();
const form2 = ref<FormInstance>();
const form3 = ref<FormInstance>();

const handleSubmit = () => {
  // 打印获取到的表单数据
  console.log(formData.value);
  // 补充后面的代码：后面的代码就是调用await接口 把数据当参数传进去
  ElMessage({
    message: "任务指派成功！",
    type: "success",
  });
  // 关闭抽屉
  drawer.value = false;
};
</script>
