<!-- 递归组件 -->
<template>
    <el-sub-menu v-if="item.children" :index="item.url">
        <!-- el-sub-menu需要加多一个template -->
        <template #title>
            <el-icon>
                <!-- <location /> -->
                <!-- 根据组件名渲染为组件 -->
                <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
        </template>
        <!-- 下面是el-sub-menu还是el-menu-item，就要做递归了 -->
        <my-menu v-for="child in item.children" :key="child.url" :item="child"></my-menu>
    </el-sub-menu>
    <el-menu-item v-else :index="item.url" @click="add(item.name, item.url, item.icon)" v-show="!(item.name == '订单详情')">
        <el-icon>
            <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.name }}</span>
    </el-menu-item>
</template>
<script lang="ts">
// 因为要用到name属性 所以不能用setup语法糖
// 所以这里用defineComponent  这里用选项式API
import { defineComponent } from "vue";
import type { MenuItem as MenuItemType } from "@/types/user"; // 用as改个名字避免混淆
import type { PropType } from "vue";
import { useTabsStore } from "@/store/tabs";
export default defineComponent({
    name: "MyMenu", // 这里是定义了MyMenu组件
    props: {
        item: {
            type: Object as PropType<MenuItemType>,
            required: true, // 必选填属性
        },
    },
    setup() {
        const tabsStore = useTabsStore();
        const { addTab, setCurrentTab } = tabsStore; // addTab是方法不是数据不用响应式不用storeToRefs
        const add = (name: string, url: string, icon: string) => {
            addTab(name, url, icon);
            // 设置当前高亮
            setCurrentTab(name, url);
        };
        return { add };
    },
});
</script>

<style lang="less" scoped>
.is-active {
    background-color: rgb(120, 200, 65);
    color: #fff !important;
    div {
        .el-icon {
            color: #fff;
        }
        span {
            color: #fff;
        }
    }
}
.el-menu-item:hover {
    background-color: rgb(120, 200, 65) !important;
    color: #fff !important;
}

// 样式穿透 ::v-deep 从 Vue 3.1 版本开始，`::v-deep` 这种使用方式已经被废弃:deep() 函数来替代
:deep(.el-sub-menu__title:hover) {
    background-color: rgb(120, 200, 65) !important;
    color: #fff !important;
}
</style>
