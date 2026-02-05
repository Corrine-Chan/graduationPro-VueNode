// 运营管理的接口
import { post, get } from "@/utils/http";

const Api = {
  OrderList: "/api/order/list",
  OrderDetail: "/api/order/detail",
  BatchDelete: "/api/order/batchDelete",
  SingleDelete: "/api/order/singleDelete",
  CityList: "/api/order/cityList",
};

// 获取订单列表
function getOrderListApi(params: any) {
  return post(Api.OrderList, params);
}

// 获取订单详情
function getOrderDetailApi(orderNo: string) {
  return post(Api.OrderDetail, { orderNo });
}

// 批量删除订单
function batchDeleteApi(order: string[]) {
  return post(Api.BatchDelete, { order });
}

// 单个删除订单
function singleDeleteApi(orderNo: string) {
  return post(Api.SingleDelete, { orderNo });
}

// 获取城市列表
function cityListApi() {
  return get(Api.CityList);
}

export {
  getOrderListApi,
  getOrderDetailApi,
  batchDeleteApi,
  singleDeleteApi,
  cityListApi,
};
