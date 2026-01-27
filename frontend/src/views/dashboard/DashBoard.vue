<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <el-card>
        <div class="title">
          <h3>今日设备运行状态</h3>
          <p class="ml" style="font-size: 16px">更新时间：2025年7月29日</p>
          <el-icon color="#86909c" style="margin-left: 5px">
            <Refresh />
          </el-icon>
        </div>
        <div class="equipment">
          <div class="item">
            <h4>充电桩使用率</h4>
            <img :src="flash" style="width: 50px; height: 50px" />
            <h1 class="mb">2556 / 3368</h1>
            <div class="statistic-card">
              <el-statistic :value="68">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip
                      effect="dark"
                      content="当前有68台设备异常，请尽快修理"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span style="font-size: 14px">相较昨日</span>
                  <span class="green">
                    24%
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <h4>充电柜使用率</h4>
            <img :src="flash2" style="width: 50px; height: 50px" />
            <h1 class="mb">622 / 1655</h1>
            <div class="statistic-card">
              <el-statistic :value="55">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip
                      effect="dark"
                      content="当前有55台设备异常，请尽快修理"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span style="font-size: 14px">相较昨日</span>
                  <span class="red">
                    22%
                    <el-icon>
                      <CaretBottom />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <h4>充电站使用率</h4>
            <img :src="flash3" style="width: 50px; height: 50px" />
            <h1 class="mb">280 / 360</h1>
            <div class="statistic-card">
              <el-statistic :value="28">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip
                      effect="dark"
                      content="当前有28台设备异常，请尽快修理"
                      placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span style="font-size: 14px">相较昨日</span>
                  <span class="green">
                    30%
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h1>常用功能</h1>
          </div>
        </template>
        <div class="quick">
          <el-row>
            <el-col :span="4">
              <img :src="daily" />
              <p>营收统计</p>
            </el-col>
            <el-col :span="4">
              <img :src="repair" />
              <p>充电桩管理</p>
            </el-col>
            <el-col :span="4">
              <img :src="total" />
              <p>电子地图</p>
            </el-col>
            <el-col :span="4">
              <img :src="progress" />
              <p>运营管理</p>
            </el-col>
            <el-col :span="4">
              <img :src="remain" />
              <p>会员卡管理</p>
            </el-col>
            <el-col :span="4">
              <img :src="money" />
              <p>招商管理</p>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h1>能源统计</h1>
          </div>
        </template>
        <el-row>
          <el-col :span="8">
            <div ref="chartRef2" style="width: 100%; height: 400px"></div>
          </el-col>
          <el-col :span="16">
            <div ref="chartRef" style="width: 100%; height: 400px"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <h1>设备综合评估</h1>
          </div>
        </template>
        <div ref="chartRef3" style="width: 100%; height: 240px"></div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h1>营收统计表</h1>
          </div>
        </template>
        <ul class="ranking-list">
          <li class="ranking-item">
            <span
              class="rank"
              style="background-color: rgb(103, 194, 58); color: #fff"
              >1</span
            >
            <span class="store-name">广州</span>
            <span class="sales">52,457</span>
            <span style="margin-left: 50px" class="percent">
              25%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
          <li class="ranking-item">
            <span
              class="rank"
              style="background-color: rgb(64, 158, 255); color: #fff"
              >2</span
            >
            <span class="store-name">上海</span>
            <span class="sales">323,234</span>
            <span style="margin-left: 50px" class="percent">
              12%
              <el-icon color="red">
                <CaretBottom />
              </el-icon>
            </span>
          </li>
          <li class="ranking-item">
            <span
              class="rank"
              style="background-color: rgb(230, 162, 60); color: #fff"
              >3</span
            >
            <span class="store-name">深圳</span>
            <span class="sales">192,255</span>
            <span style="margin-left: 50px" class="percent">
              30%
              <el-icon color="red">
                <CaretTop />
              </el-icon>
            </span>
          </li>
          <li class="ranking-item">
            <span class="rank">4</span>
            <span class="store-name">珠海</span>
            <span class="sales">17,540</span>
            <span style="margin-left: 50px" class="percent">
              24%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
          <li class="ranking-item">
            <span class="rank">5</span>
            <span class="store-name">佛山</span>
            <span class="sales">662,337</span>
            <span style="margin-left: 50px" class="percent">
              22%
              <el-icon color="red">
                <CaretBottom />
              </el-icon>
            </span>
          </li>
          <li class="ranking-item">
            <span class="rank">6</span>
            <span class="store-name">厦门</span>
            <span class="sales">22,941</span>
            <span style="margin-left: 50px" class="percent">
              20%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
          <li class="ranking-item">
            <span class="rank">7</span>
            <span class="store-name">长沙</span>
            <span class="sales">565,221</span>
            <span style="margin-left: 50px" class="percent">
              18%
              <el-icon color="green">
                <CaretTop />
              </el-icon>
            </span>
          </li>
        </ul>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h1>故障报警</h1>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            timestamp="2025/5/24"
            placement="top"
            :icon="MoreFilled"
            color="#0bbd87"
            size="large"
          >
            <el-card>
              <h4>中山公园一路5台充电桩空闲中</h4>
              <!-- <p>Tom committed 2018/4/12 20:46</p> -->
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            timestamp="2025/6/20"
            placement="top"
            type="danger"
            :hollow="true"
          >
            <el-card>
              <h4>5号充电站100号充电桩异常故障</h4>
              <!-- <p>Tom committed 2018/4/3 20:46</p> -->
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            timestamp="2025/7/31"
            placement="top"
            type="danger"
            :hollow="true"
          >
            <el-card>
              <h4>8号充电站异常断电</h4>
              <!-- <p>Tom committed 2018/4/2 20:46</p> -->
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import flash from "@/assets/flash.png";
import flash2 from "@/assets/flash2.png";
import flash3 from "@/assets/flash3.png";
import daily from "@/assets/daily.png";
import money from "@/assets/money.png";
import progress from "@/assets/progress.png";
import remain from "@/assets/remain.png";
import repair from "@/assets/repair.png";
import total from "@/assets/total.png";
import { ref, reactive } from "vue";
import { useChart } from "@/hooks/useCharts";
import { chartDataApi, chartDataApi2, chartDataApi3 } from "@/api/dashboard";
import { MoreFilled } from "@element-plus/icons-vue";

const chartRef = ref(null);
const chartRef2 = ref(null);
const chartRef3 = ref(null);

// 调用Api
const setChartData = async () => {
  const chartOptions: any = reactive({
    title: {
      text: "电量统计",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
      ],
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} kW",
      },
    },
    series: [
      {
        name: "",
        type: "line",
        data: [],
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: "#DC3C22",
          shadowBlur: 5,
          shadowColor: "rgba(0,255,0,0.3)",
        },
        smooth: true,
      },
      {
        name: "",
        type: "line",
        data: [],
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: "#1B56FD",
          shadowBlur: 5,
          shadowColor: "rgba(0,255,0,0.3)",
        },
        smooth: true,
      },
      {
        name: "",
        type: "line",
        data: [],
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: "#78C841",
          shadowBlur: 5,
          shadowColor: "rgba(0,255,0,0.3)",
        },
        smooth: true,
      },
    ],
  });
  // res是后端返回的结果 赋给给前端的chartOptions中的数据
  const res = await chartDataApi();
  chartOptions.legend.data = res.data.list.map((item: any) => item.name);
  for (let i = 0; i < res.data.list.length; i++) {
    chartOptions.series[i].name = res.data.list[i].name;
    chartOptions.series[i].data = res.data.list[i].data;
  }
  // console.log(chartOptions);
  return chartOptions;
};

const setChartData2 = async () => {
  const chartOptions: any = reactive({
    legend: {
      orient: "horizontal",
      bottom: 10,
      left: "center",
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a}<br />{b}：{c} ({d}%)",
    },
    series: [
      {
        name: "营收占比",
        type: "pie",
        radius: ["35%", "60%"],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 2,
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}",
          fontSize: 11,
          color: "#333",
          overflow: "break",
          width: 60,
          height: 20,
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 15,
          smooth: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: "bold",
          },
        },
        data: [],
      },
    ],
    graphic: {
      type: "text",
      left: "center",
      top: "center",
      style: {
        text: "营收占比",
        fontSize: 14,
        fill: "#333",
      },
    },
  });
  const res = await chartDataApi2();
  chartOptions.series[0].data = res.data.list;
  return chartOptions;
};

const setChartData3 = async () => {
  const chartOptions: any = reactive({
    radar: {
      // shape: 'circle',
      indicator: [
        { name: "充电桩使用率", max: 100 },
        { name: "充电站运行率", max: 100 },
        { name: "设备故障率", max: 100 },
        { name: "充电效率", max: 100 },
        { name: "设备维护率", max: 100 },
        { name: "系统稳定性", max: 100 },
      ],
    },
    series: [
      {
        name: "系统性能评估",
        type: "radar",
        data: [
          {
            value: [],
            name: "当前状态",
          },
        ],
      },
    ],
  });
  const res = await chartDataApi3();
  chartOptions.series[0].data[0] = res.data.list;
  return chartOptions;
};

// 传入容器和配置项
useChart(chartRef, setChartData);
useChart(chartRef2, setChartData2);
useChart(chartRef3, setChartData3);
</script>

<style lang="less" scoped>
.title {
  display: flex;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  align-items: flex-end; // 底部对齐
  p {
    color: #86909c;
  }
}
.equipment {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  .item {
    h4 {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
  .statistic-card {
    margin-top: -10px;
    .statistic-footer {
      margin-bottom: -10px;
      .green {
        color: var(--el-color-success);
      }
      .red {
        color: var(--el-color-error);
      }
    }
  }
}
.card-header {
  margin-top: -8px;
  margin-bottom: -8px;
}
.quick {
  text-align: center; //文本排列到中间
  margin-bottom: -8px;
  img {
    width: 36px;
    height: 36px;
  }
  p {
    font-size: 14px;
  }
}
.ranking-list {
  .ranking-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-size: 14px;
    .rank {
      display: inline-block;
      font-weight: bold;
      color: #666;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
    }
    .store-name {
      flex-grow: 1;
      padding: 0 10px;
      color: #303133;
      height: 30px;
      line-height: 30px;
    }
    .sales {
      color: #666;
      height: 30px;
      line-height: 30px;
    }
    .percent {
      height: 30px;
      line-height: 30px;
    }
  }
  // even页面范围内偶数的匹配元素
  .ranking-item:nth-child(even) {
    background-color: rgb(253, 246, 236);
  }
}
</style>
