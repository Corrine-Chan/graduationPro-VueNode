<template>
  <!-- 系统设置 -->
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model.trim="searchParams.name" placeholder="请输入姓名" />
      </el-col>
      <el-col :span="6">
        <el-select placeholder="请选择部门" v-model="searchParams.department">
          <el-option label="全部" value=""></el-option>
          <el-option label="总经办" value="总经办"></el-option>
          <el-option label="运营部" value="运营部"></el-option>
          <el-option label="技术部" value="技术部"></el-option>
          <el-option label="市场部" value="市场部"></el-option>
          <el-option label="财务部" value="财务部"></el-option>
          <el-option label="维修部" value="维修部"></el-option>
          <el-option label="客服部" value="客服部"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-table :data="dataList" v-loading="loading">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="idNo" label="身份证号"></el-table-column>
      <el-table-column prop="position" label="职位">
        <template #default="scope">
          <el-tag type="primary">{{ scope.row.position }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="pageAuthority" label="页面权限">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.pageAuthority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="btnAuthority" label="按钮权限">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.btnAuthority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="settingAuth(scope.row.pageAuthority, scope.row.account)"
            >权限设置</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDeleteUser(scope.row.account, scope.row.name)"
          >
            删除
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="handleDisableUser(scope.row.account, scope.row.name)"
          >
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fr mt mb"
      v-model:current-page="pageInfo.page"
      v-model:page-size="pageInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="sizes, prev, pager, next, jumper,total"
      :total="totals"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <AuthModal
    v-model:visible="visible"
    :checked-keys="checkedKeys"
    :btnAuth="btnAuth"
    :account="accountNo"
    @reload="loadData"
    @close="visible = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useHttp } from "@/hooks/useHttp";
import AuthModal from "./AuthModal.vue";
import { getAuthApi, deleteUserApi, disableUserApi } from "@/api/system";
import { ElMessage, ElMessageBox } from "element-plus";
import type { MenuItem } from "@/types/user";

interface searchType {
  name: string;
  department: string;
}
const searchParams = ref<searchType>({
  name: "",
  department: "",
});

const {
  dataList,
  loading,
  loadData,
  totals,
  pageInfo,
  handleCurrentChange,
  handleSizeChange,
  resetPagination,
} = useHttp("/permissionList", searchParams);

const handleReset = () => {
  searchParams.value = {
    name: "",
    department: "",
  };
  resetPagination();
};

const visible = ref<boolean>(false); // 这个visible是:visible="visible"的第二个visible

function collectUrls(tree: MenuItem[]) {
  // 数组扁平化:将一个多维数组转化为一维数组
  const urls: string[] = [];

  function traverse(node: MenuItem) {
    if (node.url && !node.children) {
      urls.push(node.url);
    }
    if (node.children) {
      // 如果有子级别的话 就要对里面的每一条数据继续来执行 因为children里面还有数组
      node.children.forEach((child: MenuItem) => traverse(child));
    }
  }

  tree.forEach((node: MenuItem) => traverse(node));
  return urls;
}

const checkedKeys = ref<string[]>([]);
const btnAuth = ref<string[]>([]);
const accountNo = ref<string>("");

const settingAuth = async (pageAuthority: string, account: string) => {
  const res = await getAuthApi(pageAuthority);
  console.log(res);
  accountNo.value = account;
  const {
    data: { list, btn },
  } = await getAuthApi(pageAuthority); // 解构赋值 提取出list和btn按钮权限
  console.log("提取当前权限的data中的list", list);
  console.log("获取当前权限的所有url", collectUrls(list));
  checkedKeys.value = collectUrls(list);
  btnAuth.value = btn;
  visible.value = true;
};

// 删除用户
const handleDeleteUser = async (account: string, name: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${name}" (${account}) 吗？删除后将无法恢复！`,
      "删除用户确认",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const res = await deleteUserApi(account);
    if (res.code === 200) {
      ElMessage({
        message: res.message,
        type: "success",
      });
      // 删除完后重新加载数据
      loadData();
    }
  } catch (error) {
    if (error !== "cancel") {
      console.log(error);
      ElMessage.error("删除失败，请重试");
    }
  }
};

// 禁用用户
const handleDisableUser = async (account: string, name: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要禁用用户 "${name}" (${account}) 吗？禁用后该用户将无法登录系统！`,
      "禁用用户确认",
      {
        confirmButtonText: "确定禁用",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const res = await disableUserApi(account);
    if (res.code === 200) {
      ElMessage({
        message: res.message,
        type: "success",
      });
      // 禁用完后重新加载数据
      loadData();
    }
  } catch (error) {
    if (error !== "cancel") {
      console.log(error);
      ElMessage.error("禁用失败，请重试");
    }
  }
};
</script>
