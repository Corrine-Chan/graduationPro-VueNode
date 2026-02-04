<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, ref, onUnmounted, watch } from "vue";
import { mapListApi } from "@/api/map";
import icon from "@/assets/flashIcon.png";
import station from "@/assets/station.png";

// 声明全局 AMap 类型
declare global {
  interface Window {
    AMap: any;
  }
}

let map: any = null;
let AMapInstance: any = null; // 保存 AMap 实例
const markersData = ref<any>([]);
const markers = ref<any[]>([]); // 存储所有标记对象

// 定义 props 接收刷新信号
const props = defineProps<{
  refreshTrigger?: number;
}>();

// 加载地图数据
const loadMapData = async () => {
  try {
    const { data } = await mapListApi();
    markersData.value = data;

    // 如果地图已经初始化，更新标记
    if (map && AMapInstance) {
      updateMarkers();
    }
  } catch (error) {
    console.error("加载地图数据失败:", error);
  }
};

// 更新地图标记
const updateMarkers = () => {
  if (!map || !AMapInstance) return;

  // 清除旧标记
  markers.value.forEach((marker) => {
    map.remove(marker);
  });
  markers.value = [];

  // 创建信息窗体
  const infoWindow = new AMapInstance.InfoWindow({
    offset: new AMapInstance.Pixel(0, -30),
  });

  // 添加新标记
  markersData.value.forEach((markerData: any) => {
    const marker = new AMapInstance.Marker({
      position: markerData.position,
      icon: icon,
      title: markerData.title,
    });

    marker.on("click", () => {
      const statusText = getStatusText(markerData.status);
      infoWindow.setContent(
        `<div style="display:flex;padding:10px;align-items:center">
          <img src="${station}" width="200px"/>
        </div>
        <div style="width:180px;line-height:30px;margin-left:20px">
          <h3>${markerData.title}</h3>
          <p>充电桩数量：${markerData.count}</p>
          <p>充电站状态：<span style="color:${getStatusColor(markerData.status)}">${statusText}</span></p>
          ${markerData.address ? `<p>地址：${markerData.address}</p>` : ""}
        </div>`,
      );
      infoWindow.open(map, marker.getPosition());
    });

    map.add(marker);
    markers.value.push(marker);
  });
};

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    1: "空闲中",
    2: "使用中",
    3: "维护中",
    4: "故障",
    5: "待维修",
  };
  return statusMap[status] || "未知";
};

// 获取状态颜色
const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    1: "#67C23A",
    2: "#409EFF",
    3: "#E6A23C",
    4: "#F56C6C",
    5: "#F56C6C",
  };
  return colorMap[status] || "#909399";
};

// 监听刷新信号
watch(
  () => props.refreshTrigger,
  () => {
    loadMapData();
  },
);

onMounted(() => {
  AMapLoader.load({
    key: "12d398a318d9055fbc097007ea3cebab",
    version: "1.4.15",
    plugins: [],
  })
    .then((AMap) => {
      // 保存 AMap 实例
      AMapInstance = AMap;
      window.AMap = AMap;

      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 5,
        center: [116.397428, 39.90923],
      });

      // 加载数据并添加标记
      loadMapData();
    })
    .catch((e) => {
      console.log(e);
    });
});

// 卸载
onUnmounted(() => {
  map?.destroy();
});
</script>

<style lang="less" scoped>
#container {
  width: 100%;
  height: 80vh;
}
</style>
