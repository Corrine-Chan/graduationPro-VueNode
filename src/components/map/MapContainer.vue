<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, ref, onUnmounted } from "vue";
import { mapListApi } from "@/api/map";
import icon from "@/assets/flashIcon.png";
import station from "@/assets/station.png";

let map: any = null;
const markersData = ref<any>([]);

onMounted(() => {
  //   mapListApi().then((res) => {
  //     console.log(res);
  //   });

  AMapLoader.load({
    key: "12d398a318d9055fbc097007ea3cebab", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      // map 是高德地图实例
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 5, // 初始化地图级别 缩放级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置 这个经纬度是北京的
        // center: [113.264385, 23.12911], // 这是广州的经纬度
      });

      // 添加自定义标记 {data}是对 res 的解构赋值
      mapListApi().then(({ data }) => {
        markersData.value = data; // 这样的话markersData存的就是所有充电站的数据
        // 步骤二：
        // 创建信息窗体
        const infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30),
        });
        // 步骤一：标记多少个取决于循环中数组里面有几项
        markersData.value.forEach((markerData: any) => {
          const marker = new AMap.Marker({
            position: markerData.position,
            icon: icon, //添加 icon 图标 URL
            title: "北京",
          });
          marker.on("click", () => {
            // 点击这个marker标记时
            infoWindow.setContent(
              `<div style="display:flex;padding:10px;align-items:center">
                    <img src="${station}" width="200px"/>
                </div>
                <div style="width:180px;line-height:30px;margin-left:20px">
                    <h3>${markerData.title}</h3>
                    <p>充电桩数量：${markerData.count}</p>
                    <p>充电站状态：<span style="color:blue">${
                      markerData.status === 1 ? "使用中" : "维护中"
                    }</span></p>
                </div>`
            );
            // marker.getPosition()是获取marker标记位置
            infoWindow.open(map, marker.getPosition());
          });
          map.add(marker);
        });
      });
    })
    .catch((e) => {
      // 捕获错误
      console.log(e);
    });
});

// 卸载 不然会浪费资源 组件卸载之后这个地图就不用一直占用资源
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
