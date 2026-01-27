<template>
  <!-- 权限弹窗组件 -->
  <!-- 这个visible是由父组件决定的 点击父组件的按钮才能显示是否隐藏 -->
  <el-dialog
    title="权限设置"
    :model-value="visible"
    width="600px"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-card>
      <template #header>
        <div class="card-header">
          <span>页面权限</span>
        </div>
      </template>
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        show-checkbox
        :data="treeData"
        node-key="url"
      >
      </el-tree>
    </el-card>
    <!-- <el-button @click="fn">勾选</el-button> -->
    <el-card class="mt">
      <template #header>
        <div class="card-header">
          <span>按钮权限</span>
        </div>
      </template>
      <div class="button-auth-container">
        <el-checkbox
          v-model="isAllSelected"
          @change="handleAllChange"
          :indeterminate="isIndeterminate"
        >
          全部
        </el-checkbox>
        <el-checkbox-group v-model="initBtnAuth" @change="handleBtnAuthChange">
          <el-checkbox label="添加" value="add" />
          <el-checkbox label="编辑" value="edit" />
          <el-checkbox label="删除" value="delete" />
        </el-checkbox-group>
      </div>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import { transformMenu } from "@/utils/transformMenu";
import { ref, computed } from "vue";
import { setAuthApi } from "@/api/system";
import { ElMessage } from "element-plus";

// 因为initBtnAuth 的类型 所以写成下面那样
const props = defineProps<{
  visible: boolean;
  checkedKeys: string[];
  btnAuth: string[];
  account: string;
}>();

// 定义emit事件
const emit = defineEmits(["update:visible", "close", "reload"]);

// 通过调用useUserStore拿到userStore实例
const userStore = useUserStore();
// 解构出useUserStore中的(也就是userStore实例中)的menu 使用storeToRefs保持响应式
const { menu } = storeToRefs(userStore);

// console.log(transformMenu(menu.value));
const treeData = ref(transformMenu(menu.value));

const treeRef = ref();
const initBtnAuth = ref<string[]>([]); // 按钮权限数组

// 所有可选的按钮权限
const allBtnOptions = ["add", "edit", "delete"];

// 计算是否全选
const isAllSelected = computed({
  get() {
    return allBtnOptions.every((option) => initBtnAuth.value.includes(option));
  },
  set(value: boolean) {
    if (value) {
      // 全选：添加所有权限
      initBtnAuth.value = [...allBtnOptions];
    } else {
      // 取消全选：清空所有权限
      initBtnAuth.value = [];
    }
  },
});

// 计算是否为半选状态（部分选中）
const isIndeterminate = computed(() => {
  const selectedCount = allBtnOptions.filter((option) =>
    initBtnAuth.value.includes(option),
  ).length;
  return selectedCount > 0 && selectedCount < allBtnOptions.length;
});

// 处理全选/取消全选
const handleAllChange = (value: boolean) => {
  if (value) {
    // 勾选全部时，自动勾选所有子权限
    initBtnAuth.value = [...allBtnOptions];
  } else {
    // 取消全部时，清空所有子权限
    initBtnAuth.value = [];
  }
};

// 处理子权限变化
const handleBtnAuthChange = (value: string[]) => {
  initBtnAuth.value = value;
  // 这里不需要额外处理，computed属性会自动更新isAllSelected和isIndeterminate
};

const handleOpen = () => {
  console.log("弹窗打开，接收到的checkedKeys:", props.checkedKeys);
  console.log("弹窗打开，接收到的btnAuth:", props.btnAuth);

  // 设置树形控件的选中状态
  if (props.checkedKeys && props.checkedKeys.length > 0) {
    treeRef.value?.setCheckedKeys(props.checkedKeys);
  }

  // 设置按钮权限，过滤掉"all"选项，只保留具体的权限
  initBtnAuth.value = props.btnAuth.filter((auth) => auth !== "all");
};

const handleClose = () => {
  // 关闭弹窗
  emit("update:visible", false);
};

const handleConfirm = async () => {
  try {
    // 构建最终的按钮权限数组
    let finalBtnAuth = [...initBtnAuth.value];

    // 如果全选了，添加"all"标识
    if (isAllSelected.value) {
      finalBtnAuth = ["all", ...finalBtnAuth];
    }

    const res = await setAuthApi(
      props.account,
      treeRef.value.getCheckedKeys(true),
      finalBtnAuth,
    );

    if (res.code == 200) {
      ElMessage({
        message: res.message,
        type: "success",
      });

      // 关闭弹窗 - 这里需要更新visible状态
      emit("update:visible", false); // 可以用emit("close")那样的写法 不过父组件那里就要修改
      emit("reload"); // 要让父组件去重新加载
    }
  } catch (error) {
    console.error("权限设置失败:", error);
    ElMessage({
      message: "权限设置失败，请重试",
      type: "error",
    });
  }
};
</script>
<style scoped>
.button-auth-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-auth-container .el-checkbox-group {
  margin-left: 24px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  flex-wrap: wrap;
}

.button-auth-container .el-checkbox-group .el-checkbox {
  margin-right: 0;
}

.mt {
  margin-top: 16px;
}
</style>
