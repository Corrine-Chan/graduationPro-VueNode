<template>
  <!-- 订单详情页 -->
  <el-card v-loading="loading">
    <!-- 如果没有订单编号，显示提示信息 -->
    <div v-if="!orderNo" class="no-order-tip">
      <el-alert
        title="未找到订单信息"
        description="请从订单管理页面点击详情按钮进入，或者检查订单编号是否正确。"
        type="warning"
        :closable="false"
        show-icon
      />
      <div class="mt">
        <el-button type="primary" @click="goToOrders">返回订单管理</el-button>
      </div>
    </div>

    <!-- 有订单编号时显示详情 -->
    <div v-else-if="orderDetail">
      <!-- 使用计算属性来获取订单编号 -->
      <el-descriptions :title="`订单编号：${orderNo}`">
        <el-descriptions-item label="订单编号">
          <el-tag size="small">
            {{ orderDetail.orderNo }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备编号">
          {{ orderDetail.equipmentNo }}
        </el-descriptions-item>
        <el-descriptions-item label="订单日期">
          {{ orderDetail.orderDate }}
        </el-descriptions-item>
        <el-descriptions-item label="站点名称">
          <el-tag size="small">{{ orderDetail.stationName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ orderDetail.startTime }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ orderDetail.endTime || "充电中" }}
        </el-descriptions-item>
        <el-descriptions-item label="订单金额(元)">
          {{ orderDetail.totalAmount }}
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">
          {{ orderDetail.paymentMethod }}
        </el-descriptions-item>
        <el-descriptions-item label="所属城市">
          {{ orderDetail.city }}
        </el-descriptions-item>
        <el-descriptions-item label="充电量(kWh)">
          {{ orderDetail.energyConsumed || "充电中" }}
        </el-descriptions-item>
        <el-descriptions-item label="充电设备">
          {{ orderDetail.equipmentType }}
        </el-descriptions-item>
        <el-descriptions-item label="充电总时长(小时)">
          {{ orderDetail.chargingDuration || "充电中" }}
        </el-descriptions-item>
        <el-descriptions-item label="负责人姓名">
          {{ orderDetail.managerName }}
        </el-descriptions-item>
        <el-descriptions-item label="负责人电话">
          {{ orderDetail.managerTel }}
        </el-descriptions-item>
        <el-descriptions-item label="维保人员姓名">
          {{ orderDetail.maintenanceName }}
        </el-descriptions-item>
        <el-descriptions-item label="维保人员电话">
          {{ orderDetail.maintenanceTel }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag size="small" :type="getStatusType(orderDetail.status)">
            {{ getStatusText(orderDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="服务费(元)">
          {{ orderDetail.serviceFee }}
        </el-descriptions-item>
        <el-descriptions-item label="停车费(元)">
          {{ orderDetail.parkingFee }}
        </el-descriptions-item>
        <el-descriptions-item label="电费(元)">
          {{ orderDetail.electricityFee }}
        </el-descriptions-item>
        <el-descriptions-item label="收费信息" :span="3">
          {{ orderDetail.chargeInfo }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="3">
          {{ orderDetail.remarks }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderStore } from "@/store/order";
import { useTabsStore } from "@/store/tabs";
import { storeToRefs } from "pinia";
import { getOrderDetailApi } from "@/api/operation";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const tabsStore = useTabsStore();
const { currentOrderNo } = storeToRefs(orderStore);
const { addTab, setCurrentTab } = tabsStore;

const loading = ref(false);
const orderDetail = ref<any>(null);

// 计算属性：优先使用store中的订单编号，如果没有则使用路由参数
const orderNo = computed(() => {
  // 优先使用store中保存的订单编号
  if (currentOrderNo.value) {
    return currentOrderNo.value;
  }

  // 如果store中没有，则尝试从路由参数获取
  if (route.query.orderNo) {
    // 同时更新store中的订单编号，以便后续使用
    orderStore.setCurrentOrderNo(route.query.orderNo as string);
    return route.query.orderNo as string;
  }

  // 如果都没有，返回空字符串
  return "";
});

// 获取订单详情
const fetchOrderDetail = async () => {
  if (!orderNo.value) return;

  loading.value = true;
  try {
    const res = await getOrderDetailApi(orderNo.value);
    if (res.code === 200) {
      orderDetail.value = res.data;
    } else {
      ElMessage.error(res.message || "获取订单详情失败");
    }
  } catch (error) {
    console.error("获取订单详情失败:", error);
    ElMessage.error("获取订单详情失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 监听订单号变化
watch(
  orderNo,
  (newVal) => {
    if (newVal) {
      fetchOrderDetail();
    }
  },
  { immediate: true },
);

// 返回订单管理页面
const goToOrders = () => {
  // 添加页签
  addTab("订单管理", "/operations/orders", "DocumentCopy");
  // 设置为当前页签
  setCurrentTab("订单管理", "/operations/orders");
  // 跳转到订单管理页面
  router.push("/operations/orders");
};

// 获取状态类型
const getStatusType = (status: number) => {
  const statusMap: Record<number, string> = {
    2: "success",
    3: "primary",
    4: "warning",
  };
  return statusMap[status] || "";
};

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    2: "进行中",
    3: "已完成",
    4: "异常",
  };
  return statusMap[status] || "未知";
};
</script>

<style scoped>
.no-order-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 200px;
}

.no-order-tip .el-alert {
  max-width: 600px;
  width: 100%;
}

.mt {
  margin-top: 20px;
}
</style>
