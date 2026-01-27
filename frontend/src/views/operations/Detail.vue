<template>
  <!-- 订单详情页 -->
  <el-card>
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
    <div v-else>
      <!-- 使用计算属性来获取订单编号 -->
      <el-descriptions :title="`订单编号：${orderNo}`">
        <el-descriptions-item label="订单编号">
          <el-tag size="small">
            {{ orderNo }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备编号"
          >18100000000</el-descriptions-item
        >
        <el-descriptions-item label="订单日期">Suzhou</el-descriptions-item>
        <el-descriptions-item label="站点名称">
          <el-tag size="small">北京西单充电站</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="结束时间"> 10:34:24 </el-descriptions-item>
        <el-descriptions-item label="订单金额(元)">66.5</el-descriptions-item>
        <el-descriptions-item label="支付方式">支付宝</el-descriptions-item>
        <el-descriptions-item label="所属城市">北京</el-descriptions-item>
        <el-descriptions-item label="充电量">86</el-descriptions-item>
        <el-descriptions-item label="充电设备"
          >充电桩(快充)</el-descriptions-item
        >
        <el-descriptions-item label="充电总时长(小时)">2</el-descriptions-item>
        <el-descriptions-item label="负责人姓名">张三</el-descriptions-item>
        <el-descriptions-item label="负责人电话"
          >18634565433</el-descriptions-item
        >
        <el-descriptions-item label="维保人员姓名">李四</el-descriptions-item>
        <el-descriptions-item label="维保人员电话"
          >13563456543</el-descriptions-item
        >
        <el-descriptions-item label="订单状态">
          <el-tag size="small"> 已完成 </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="服务费(元)">8.0</el-descriptions-item>
        <el-descriptions-item label="停车费(元)">10.0</el-descriptions-item>
        <el-descriptions-item label="电费(元)">54.0</el-descriptions-item>
        <el-descriptions-item label="收费信息"
          >电费+服务费+停车费，高峰时段费用为2.3元一度，停车费2元/小时，服务费5元/次</el-descriptions-item
        >
        <el-descriptions-item label="备注">暂无</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderStore } from "@/store/order";
import { useTabsStore } from "@/store/tabs";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const tabsStore = useTabsStore();
const { currentOrderNo } = storeToRefs(orderStore);
const { addTab, setCurrentTab } = tabsStore;

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

// 返回订单管理页面
const goToOrders = () => {
  // 添加页签
  addTab("订单管理", "/operations/orders", "DocumentCopy");
  // 设置为当前页签
  setCurrentTab("订单管理", "/operations/orders");
  // 跳转到订单管理页面
  router.push("/operations/orders");
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
