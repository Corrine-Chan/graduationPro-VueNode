<template>
  <div class="logo">
    <img :src="logo" width="34px" height="34px" />
    <h1>绿闪桩</h1>
  </div>
  <el-menu :router="true" :default-active="$route.path">
    <!-- key是独一无二的，url是独一无二的 -->
    <menu-item
      v-for="item in menuitems"
      :item="item"
      :key="item.url || item.name"
    ></menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/auth";
import MenuItem from "./MenuItem.vue";
import logo from "@/assets/logo.png";
const userStore = useUserStore();
const menuitems = userStore.menu;
console.log(userStore.menu);
</script>

<style lang="less" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center; // 这三行是居中
  height: 50px;
  padding: 10px 0;
  img {
    margin-left: -10px;
  }
  h1 {
    color: #333;
    font-size: 22px;
  }
}
.el-menu {
  border-right: none;
}
</style>
