import type { MenuItem } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useTabsStore = defineStore("tabs", () => {
  // 泛型是之前定义过的 MenuItem的数组
  const tabs = ref<MenuItem[]>([]);
  // 默认选中的页签
  const currentTab = ref<{ name: string; url: string }>({ name: "", url: "" });

  const addTab = (name: string, url: string, icon: string) => {
    if (!tabs.value.some((tab) => tab.url === url)) {
      tabs.value.push({ name, url, icon });
    }
  };
  // 设置当前页签高亮
  const setCurrentTab = (name: string, url: string) => {
    currentTab.value = { name, url };
  };

  // 删除页签
  const delTab = (tabName: string) => {
    const currentIndex = tabs.value.findIndex((item) => item.name == tabName); // findIndex找角标
    // console.log("currentIndex",currentIndex);
    // 删除标签
    tabs.value = tabs.value.filter((item) => item.name !== tabName); // 过滤 去筛选符合指定条件的数据 把等于的name删除了
    // 如果删除的是当前激活的标签
    if (tabName === currentTab.value.name) {
      // 如果还有剩余标签
      if (tabs.value.length > 0) {
        // 如果删除的是第一个标签 激活新的第一个标签 (也就是把第二个标签变成第一个)
        if (currentIndex === 0) {
          currentTab.value = {
            name: tabs.value[0].name,
            url: tabs.value[0].url,
          };
        } else {
          // 否则激活删除位置的前一个标签
          currentTab.value = {
            name: tabs.value[currentIndex - 1].name, // 当前标签的下一个
            url: tabs.value[currentIndex - 1].url,
          };
        }
      } else {
        // 如果没有剩余标签，清空当前激活标签
        currentTab.value = { name: "", url: "" };
      }
    }
  };

  // 清空所有页签（用于用户退出登录时）
  const clearAllTabs = () => {
    tabs.value = [];
    currentTab.value = { name: "", url: "" };
  };

  return { tabs, addTab, currentTab, setCurrentTab, delTab, clearAllTabs };
});
