import { get, post } from "@/utils/http";
import type { RowType } from "@/types/station";

interface ListType {
  // 后端接口的5个参数的类型
  page: number; // 必传
  pageSize: number; // 必传
  name?: string; // name不是必要的 可选 用?
  id?: string;
  status: number; // 必传
}

// 营收统计分页
interface RevenueType {
  page: number;
  pageSize: number;
  name: string;
}

const Api = {
  // 根据后端接口写
  List: "/api/station/list",
  Edit: "/api/station/edit",
  Delete: "/api/station/delete",
  Stats: "/api/station/stats",
  RevenueChart: "/revenueChart",
  Revenue: "/revenueList",
  CurrentList: "/currentList",
};
function listApi(data: ListType) {
  // 要传参根据后端接口来
  return post(Api.List, data);
}
function editApi(data: RowType) {
  return post(Api.Edit, data);
}
// 根据id去删
function deleteApi(id: string) {
  return post(Api.Delete, { id });
}

function chartApi() {
  return get(Api.RevenueChart);
}
function revenueApi(data: RevenueType) {
  return post(Api.Revenue, data);
}

// 充电桩列表
function currentListApi() {
  return post(Api.CurrentList);
}

// 获取充电站统计数据
function getStationStatsApi() {
  return get(Api.Stats);
}

export {
  listApi,
  editApi,
  deleteApi,
  chartApi,
  revenueApi,
  currentListApi,
  getStationStatsApi,
};
