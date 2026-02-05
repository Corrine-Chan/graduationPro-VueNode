<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入订单号"
          v-model.trim="searchParams.orderNo"
        />
      </el-col>
      <el-col :span="6">
        <el-select placeholder="订单状态" v-model="searchParams.status">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="异常" :value="4"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="设备编号" v-model.trim="searchParams.no" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-col>
      <el-col :span="6" class="mt">
        <el-input
          placeholder="请输入站点名称"
          v-model.trim="searchParams.name"
        />
      </el-col>
      <el-col :span="6" class="mt">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="/"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          @change="handleChange"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card class="mt">
    <el-button
      type="danger"
      :disabled="!selectionList.length"
      @click="handleBatchDelete"
      >批量删除</el-button
    >
    <el-button
      type="primary"
      icon="Download"
      :disabled="!selectionList.length"
      @click="exportToExcel"
      >导出订单数据到Excel</el-button
    >
  </el-card>
  <el-card class="mt">
    <el-table
      :data="dataList"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column type="index" label="序号" width="65"></el-table-column>
      <el-table-column label="订单号" prop="orderNo"></el-table-column>
      <el-table-column label="设备编号" prop="equipmentNo"></el-table-column>
      <el-table-column label="订单日期" prop="date"></el-table-column>
      <el-table-column label="开始时间" prop="startTime"></el-table-column>
      <el-table-column label="结束时间" prop="endTime"></el-table-column>
      <el-table-column label="金额" prop="money"></el-table-column>
      <el-table-column label="支付方式" prop="pay"></el-table-column>
      <el-table-column label="订单状态" prop="status">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.status === 2">进行中</el-tag>
          <el-tag type="primary" v-else-if="scope.row.status === 3"
            >已完成</el-tag
          >
          <el-tag type="warning" v-else-if="scope.row.status === 4"
            >异常</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 点击该事件handleDetail(scope.row.orderNo)拿到订单号 -->
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(scope.row.orderNo)"
            >详情</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleSingleDelete(scope.row.orderNo)"
          >
            删除
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
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useHttp } from "@/hooks/useHttp";
import {
  batchDeleteApi,
  singleDeleteApi,
  getOrderListApi,
} from "@/api/operation";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
// 使用封装好的页签
import { useTabsStore } from "@/store/tabs";
// 引入订单store
import { useOrderStore } from "@/store/order";
// 引入xlsx库 和 file-saver库
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// 规定类型 严谨一点 查询参数的类型
interface SearchType {
  orderNo: string;
  status: number;
  no: string;
  name: string;
  startDate: string;
  endDate: string;
}

// 定义表格数据的类型
interface SelectionListType {
  orderNo: string;
  equipmentNo: string;
  date: string;
  startTime: string;
  endTime: string;
  money: string;
  pay: string;
  status: number;
}

const date = ref();

// 定义好SearchType类型后 就可以给ref设置这个类型了
const searchParams = ref<SearchType>({
  orderNo: "", // 订单号
  status: 1, // 订单状态
  no: "", // 设备编号
  name: "", // 站点名称
  startDate: "", // 开始日期
  endDate: "", // 结束日期
});

const handleChange = (val: string) => {
  // 打印出是一个时间的对象 Proxy(Array) {0: Mon Dec 01 2025 00:00:00 GMT+0800 (中国标准时间), 1: Thu Jan 01 2026 00:00:00 GMT+0800 (中国标准时间)}
  // 如果使用了value-format="YYYY-MM-DD" 那么打印出来就是2025-12-26的形式
  //   console.log(val);
  searchParams.value.startDate = val[0];
  searchParams.value.endDate = val[1];
};

// 调用封装好的useHttp
// 第一个参数是请求地址 第二个参数是初始参数，就是那个查询参数不带分页的
// ref 数据要.value
const {
  dataList,
  loading,
  totals,
  pageInfo,
  loadData,
  handleSizeChange,
  handleCurrentChange,
  resetPagination,
} = useHttp<SelectionListType>("/api/order/list", searchParams); // 使用新的API路径

// 重置方法
const handleReset = () => {
  ((date.value = ""),
    (searchParams.value = {
      orderNo: "",
      status: 1,
      no: "",
      name: "",
      startDate: "",
      endDate: "",
    }));
  resetPagination(); // 这里面已经有这个loadData方法了
};

const selectionList = ref<SelectionListType[]>([]);
// 勾选的函数
const handleSelectionChange = (selection: SelectionListType[]) => {
  // 所以这个selection是一个数组类型
  console.log(selection); //打印出来是勾选数据后的数组
  selectionList.value = selection;
};

// 批量删除操作
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectionList.value.length} 个订单吗？`,
      "批量删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    // 所勾选的项(数组) 但是selectionList.value这个数组存放的是一整行的数据
    // 用map返回一个新数组 对取出的数组里面指定的数据
    const res = await batchDeleteApi(
      selectionList.value.map((item: SelectionListType) => item.orderNo),
    );
    if (res.code) {
      ElMessage({
        message: res.data,
        type: "success",
      });
      // 批量删除完后要重新加载表格数据
      loadData();
    }
  } catch (error) {
    if (error !== "cancel") {
      console.log(error);
      ElMessage.error("删除失败，请重试");
    }
  }
};

// 单个删除操作
const handleSingleDelete = async (orderNo: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除订单号为 ${orderNo} 的订单吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const res = await singleDeleteApi(orderNo);
    if (res.code === 200) {
      ElMessage({
        message: res.data,
        type: "success",
      });
      // 删除完后要重新加载表格数据
      loadData();
    }
  } catch (error) {
    if (error !== "cancel") {
      console.log(error);
      ElMessage.error("删除失败，请重试");
    }
  }
};

// 使用路由传参
const router = useRouter();
// 使用页签 因为点击去详情页不仅跳路径还会新开一个页签
const tabsStore = useTabsStore();
// 使用订单store
const orderStore = useOrderStore();
// 解构赋值
const { addTab, setCurrentTab } = tabsStore;
const { setCurrentOrderNo } = orderStore;

// 点击详情页事件 拿到订单号
const handleDetail = (orderNo: string) => {
  // 保存订单编号到store中
  setCurrentOrderNo(orderNo);

  // 添加页签
  addTab("订单详情", "/operations/detail", "Share");
  // 设置为当前页签
  setCurrentTab("订单详情", "/operations/detail");
  // basicRouteMap有路径 这个要携带参数 ?xxxx 注意后面不要漏掉=号
  router.push("/operations/detail?orderNo=" + orderNo);
};

// 拿到当前路由
const route = useRoute();
// watch 监听当前路由对象中的name属性
// watch 第一个参数是侦听器的源 第二个参数是发生变化时要调用的回调函数 接收三个参数：新值、旧值和清理副作用的回调函数
watch(
  () => route.name,
  (to, from) => {
    console.log(to, from);
    // 如果去的是订单页 并且不是从详情页中来的
    if (to == "orders" && from != "detail") {
      loadData(); // 加载数据
    }
  },
);

// 导出Excel
const exportToExcel = () => {
  // 导出勾选的数据
  const ws = XLSX.utils.json_to_sheet(selectionList.value); // 把数据转成工作表格式
  const wb = XLSX.utils.book_new(); // 创建新的工作表
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // 把工作表加入到工作簿中 命名为Sheet1
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, "导入的数据.xlsx");
};
</script>
