<template>
  <!-- 充电桩管理 -->
  <el-card>
    <el-select
      style="width: 300px"
      placeholder="选择站点名称"
      v-model="selectedStation"
      filterable
      @change="handleStationChange"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :value="item.id"
        :label="item.name"
      ></el-option>
    </el-select>
  </el-card>
  <el-card class="mt">
    <el-radio-group
      size="large"
      v-model="selectedStatus"
      @change="handleStatusChange"
    >
      <el-radio-button :label="`全部(${allCount})`" :value="0" />
      <el-radio-button :label="`空闲中(${statusCounts[1] || 0})`" :value="1" />
      <el-radio-button :label="`充电中(${statusCounts[2] || 0})`" :value="2" />
      <el-radio-button :label="`连接中(${statusCounts[3] || 0})`" :value="3" />
      <el-radio-button :label="`排队中(${statusCounts[4] || 0})`" :value="4" />
      <el-radio-button :label="`已预约(${statusCounts[5] || 0})`" :value="5" />
      <el-radio-button
        :label="`故障/离线(${statusCounts[6] || 0})`"
        :value="6"
      />
    </el-radio-group>
  </el-card>
  <el-card class="mt">
    <el-row :gutter="20">
      <el-col
        :span="6"
        v-for="(item, index) in filteredPiles"
        :key="`${item.id}-${index}`"
      >
        <div class="item">
          <div class="pic">
            <p v-if="item.status === 1">空闲中</p>
            <p v-else-if="item.status === 2">充电中</p>
            <p v-else-if="item.status === 3">连接中</p>
            <p v-else-if="item.status === 4">排队中</p>
            <p v-else-if="item.status === 5">已预约</p>
            <p v-else-if="item.status === 6">故障/离线</p>
            <img v-if="item.status === 1" :src="free" width="100px" />
            <img v-else-if="item.status === 2" :src="free" width="100px" />
            <img v-else-if="item.status === 3" :src="ing" width="100px" />
            <img v-else-if="item.status === 4" :src="ing" width="100px" />
            <img v-else-if="item.status === 5" :src="ing" width="100px" />
            <img v-else-if="item.status === 6" :src="outline" width="100px" />
            <p v-if="item.status === 2">{{ item.percent }}</p>
            <p v-else>0%</p>
          </div>
          <div class="info">
            <h3>{{ item.id }}</h3>
            <hr class="mb" />
            <p>电压：{{ item.voltage }}</p>
            <p>电流：{{ item.current }}</p>
            <p>功率：{{ item.power }}</p>
            <p>温度：{{ item.tem }}</p>
          </div>
        </div>
        <div class="btn">
          <div class="divider">
            <div>
              <div>
                <p class="fl ml">暂无预警</p>
                <div class="fr" style="text-align: right">
                  <el-popover
                    placement="right"
                    :width="400"
                    trigger="click"
                    popper-class="maintenance-popover"
                  >
                    <template #reference>
                      <el-button
                        size="small"
                        @click="showMaintenanceRecord(item)"
                        >维修记录</el-button
                      >
                    </template>
                    <h3 style="margin-bottom: 16px">维修记录</h3>
                    <div
                      v-if="
                        item.maintenanceRecord &&
                        item.maintenanceRecord.length > 0
                      "
                    >
                      <el-timeline>
                        <el-timeline-item
                          v-for="record in item.maintenanceRecord"
                          :key="record.id"
                          :timestamp="record.createdAt"
                          :type="
                            getMaintenanceStatusType(record.maintenanceStatus)
                          "
                          hollow
                        >
                          <div class="maintenance-item">
                            <div class="maintenance-header">
                              <el-tag
                                :type="
                                  getMaintenanceTypeTag(record.maintenanceType)
                                "
                                size="small"
                              >
                                {{
                                  getMaintenanceTypeText(record.maintenanceType)
                                }}
                              </el-tag>
                              <el-tag
                                :type="
                                  getMaintenanceStatusTag(
                                    record.maintenanceStatus,
                                  )
                                "
                                size="small"
                                style="margin-left: 8px"
                              >
                                {{
                                  getMaintenanceStatusText(
                                    record.maintenanceStatus,
                                  )
                                }}
                              </el-tag>
                            </div>
                            <p class="fault-type">
                              <strong>{{ record.faultType }}</strong>
                            </p>
                            <p class="fault-desc">
                              {{ record.faultDescription }}
                            </p>
                            <div
                              v-if="record.technician"
                              class="maintenance-info"
                            >
                              <p>维修师傅：{{ record.technician }}</p>
                              <p v-if="record.startTime">
                                开始时间：{{ record.startTime }}
                              </p>
                              <p v-if="record.endTime">
                                完成时间：{{ record.endTime }}
                              </p>
                              <p v-if="record.cost > 0">
                                维修费用：¥{{ record.cost }}
                              </p>
                            </div>
                            <p v-if="record.note" class="maintenance-note">
                              备注：{{ record.note }}
                            </p>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                    <el-empty
                      v-else
                      description="暂无维修记录"
                      :image-size="80"
                    />
                  </el-popover>
                  <el-popover
                    placement="right"
                    :width="300"
                    trigger="click"
                    popper-class="record-popover"
                  >
                    <template #reference>
                      <el-button size="small" type="primary" class="mr"
                        >使用记录</el-button
                      >
                    </template>
                    <h3 style="margin-bottom: 16px">使用记录</h3>
                    <!-- 判断是否有使用记录数据 有数据正常显示时间线 -->
                    <div v-if="item.record && item.record.length > 0">
                      <el-timeline>
                        <el-timeline-item
                          :timestamp="j.time"
                          v-for="j in item.record"
                          :key="j.time"
                          type="primary"
                          hollow
                        >
                          {{ j.msg }}
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                    <el-empty
                      v-else
                      description="暂无使用记录"
                      :image-size="80"
                    />
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import free from "@/assets/free.png";
import ing from "@/assets/ing.png";
import outline from "@/assets/outline.png";
import { currentListApi } from "@/api/chargingstation";
import { computed, onMounted, ref } from "vue";

// 所有站点数据
const options = ref<any>([]);
// 当前选中的站点ID
const selectedStation = ref<string>("");
// 当前选中的状态（0=全部）
const selectedStatus = ref<number>(0);
// 当前站点的所有充电桩（原始数据，不修改）
const allPiles = ref<any>([]);

// 加载数据
const loadData = async () => {
  const { data } = await currentListApi();
  console.log("API返回数据:", data);

  options.value = data;

  if (data && data.length > 0) {
    // 默认选择第一个站点
    selectedStation.value = data[0].id;
    allPiles.value = data[0].list || [];
    console.log("初始化充电桩数据:", allPiles.value);
  }
};

// 计算每个状态的数量
const statusCounts = computed(() => {
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 6; i++) {
    counts[i] = allPiles.value.filter(
      (item: any) => Number(item.status) === i,
    ).length;
  }
  console.log("状态统计:", counts);
  return counts;
});

// 计算总数
const allCount = computed(() => {
  return Object.values(statusCounts.value).reduce(
    (sum, count) => sum + count,
    0,
  );
});

// 筛选后的充电桩列表（使用计算属性）
const filteredPiles = computed(() => {
  console.log("=== 计算 filteredPiles ===");
  console.log("selectedStatus:", selectedStatus.value);
  console.log("allPiles 长度:", allPiles.value.length);

  if (selectedStatus.value === 0) {
    console.log("显示全部");
    return allPiles.value;
  }

  const filtered = allPiles.value.filter((item: any) => {
    const match = Number(item.status) === Number(selectedStatus.value);
    console.log(`${item.id}: status=${item.status}, 匹配=${match}`);
    return match;
  });

  console.log("筛选结果:", filtered.map((i: any) => i.id).join(", "));
  return filtered;
});

// 状态改变处理
const handleStatusChange = () => {
  console.log("状态改变为:", selectedStatus.value);
};

// 站点改变处理
const handleStationChange = () => {
  console.log("站点改变为:", selectedStation.value);
  const station = options.value.find(
    (item: any) => item.id === selectedStation.value,
  );
  if (station) {
    allPiles.value = station.list || [];
    selectedStatus.value = 0; // 重置为全部
    console.log("切换站点，充电桩数据:", allPiles.value);
  }
};

// 挂载时加载数据
onMounted(() => {
  loadData();
});

// 显示维修记录
const showMaintenanceRecord = (pile: any) => {
  console.log("查看维修记录:", pile.id, pile.maintenanceRecord);
};

// 获取维修类型文本
const getMaintenanceTypeText = (type: number) => {
  const types: Record<number, string> = {
    1: "日常维护",
    2: "故障维修",
    3: "紧急抢修",
  };
  return types[type] || "未知";
};

// 获取维修类型标签颜色
const getMaintenanceTypeTag = (type: number) => {
  const tags: Record<number, string> = {
    1: "info",
    2: "warning",
    3: "danger",
  };
  return tags[type] || "";
};

// 获取维修状态文本
const getMaintenanceStatusText = (status: number) => {
  const statuses: Record<number, string> = {
    1: "待维修",
    2: "维修中",
    3: "已完成",
  };
  return statuses[status] || "未知";
};

// 获取维修状态标签颜色
const getMaintenanceStatusTag = (status: number) => {
  const tags: Record<number, string> = {
    1: "warning",
    2: "primary",
    3: "success",
  };
  return tags[status] || "";
};

// 获取维修状态时间线类型
const getMaintenanceStatusType = (status: number) => {
  const types: Record<number, string> = {
    1: "warning",
    2: "primary",
    3: "success",
  };
  return types[status] || "info";
};
</script>

<style lang="less" scoped>
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: rgb(247, 251, 254);
  padding: 10px;
  border-radius: 10px 10px 0 0;
  margin-top: 20px;
  .pic {
    p {
      width: 76px;
      text-align: center;
      margin-bottom: 10px;
      color: rgb(32, 184, 91);
    }
  }
  .info {
    color: #999;
    margin-left: 30px;
    line-height: 26px;
    margin-top: -10px;
  }
}
.btn {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #f7fbfe;
  .divider {
    background-color: #f4f4f4;
    height: 2px;
    width: 95%;
    margin: auto;
  }
}

// 使用记录 Popover 样式（全局样式，不使用 scoped）
</style>

<style lang="less">
.record-popover {
  padding: 16px 16px 8px 16px !important; // 减少底部内边距 上右下左

  .el-timeline {
    margin: 0;
    padding: 0;

    // 移除最后一个时间线项的底部间距
    .el-timeline-item:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
}

// 维修记录 Popover 样式
.maintenance-popover {
  padding: 16px 16px 8px 16px !important;
  max-height: 500px;
  overflow-y: auto;

  .el-timeline {
    margin: 0;
    padding: 0;

    .el-timeline-item:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }

  .maintenance-item {
    font-size: 13px;
    line-height: 1.6;

    .maintenance-header {
      margin-bottom: 8px;
    }

    .fault-type {
      margin: 8px 0 4px 0;
      font-size: 14px;
      color: #303133;
    }

    .fault-desc {
      margin: 4px 0;
      color: #606266;
    }

    .maintenance-info {
      margin: 8px 0;
      padding: 8px;
      background-color: #f5f7fa;
      border-radius: 4px;
      font-size: 12px;

      p {
        margin: 4px 0;
        color: #606266;
      }
    }

    .maintenance-note {
      margin: 8px 0 0 0;
      padding: 8px;
      background-color: #fef0f0;
      border-left: 3px solid #f56c6c;
      border-radius: 4px;
      font-size: 12px;
      color: #606266;
    }
  }
}
</style>
