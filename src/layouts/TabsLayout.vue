<template>
  <el-tabs
    v-model="currentTab.name"
    class="demo-tabs"
    @tab-click="handleClick"
    type="card"
    closable
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.name"
      :name="item.name"
    >
      <template #label>
        <span class="custom-tabs-label">
          <el-icon>
            <!-- <calendar /> -->
            <component :is="item.icon"></component>
          </el-icon>
          <span>&nbsp;{{ item.name }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component
        :is="Component"
        :key="$route.name"
        v-if="$route.meta.keepAlive"
      ></component>
    </KeepAlive>
    <component
      :is="Component"
      :key="$route.name"
      v-if="!$route.meta.keepAlive"
    ></component>
  </RouterView>
  <!-- <RouterView /> -->
</template>
<script setup lang="ts">
// import type { TabsPaneContext } from "element-plus";
import { useTabsStore } from "@/store/tabs";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/auth";
const router = useRouter();
const route = useRoute(); // 获取当前路由
console.log(route);

const handleClick = ({ index }: { index: number }) => {
  console.log(index);
  router.push(tabs.value[index].url); // 高亮随路径变换
  setCurrentTab(tabs.value[index].name, tabs.value[index].url); // 设置当前高亮
};
const removeTab = (TabPaneName: string) => {
  // console.log(TabPaneName);
  delTab(TabPaneName);
  router.push(currentTab.value.url);
};

const tabsStore = useTabsStore();
const { tabs, currentTab } = storeToRefs(tabsStore); // storeToRefs保证解构赋值不丢失响应式
console.log(tabs.value);
const { setCurrentTab, addTab, delTab } = tabsStore;

const userStore = useUserStore();
const { menu } = storeToRefs(userStore); // 需要用到useUserStore中的menu 所以解构赋值

// 递归 arr数组类型比较复杂直接写any
function findObjectByUrl(arr: any[], url: string) {
  for (const item of arr) {
    if (item.url === url) {
      // 这里的item指的是mock中index中的每一项{name:xxx,url:xxx,icon:xxx}
      return item; // 如何符合路径就把这个item返回出去
    }
    if (item.children) {
      // 如何项里面有子集 就继续递归操作
      const found: any = findObjectByUrl(item.children, url);
      if (found) {
        return found;
      }
    }
  }
  return null; // 全都不存在就返回空
}
// 调用递归函数，传入menu数组 当前路由的路径
// console.log(findObjectByUrl(menu.value, route.path));
const { name, url, icon } = findObjectByUrl(menu.value, route.path); //获得后解构赋值
addTab(name, url, icon);
setCurrentTab(name, url);
</script>

<style lang="less" scoped>
.demo-tabs {
  :deep(.is-active) {
    background-color: rgba(120, 200, 65, 0.8) !important;
    color: #fff !important;
  }
  :deep(.is-top:hover) {
    color: rgb(120, 200, 65);
  }
}
</style>
