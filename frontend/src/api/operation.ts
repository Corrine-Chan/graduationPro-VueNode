// 运营管理的接口
import { post, get } from "@/utils/http";

const Api = {
  BatchDelete: "/batchDelete",
  SingleDelete: "/singleDelete",
  CityList: "/cityList",
};

// 这里要传一个对象 对象的属性名是order 是一个数组 用es6的语法写为{order}
function batchDeleteApi(order: string[]) {
  return post(Api.BatchDelete, { order });
}

// 单个删除订单
function singleDeleteApi(orderNo: string) {
  return post(Api.SingleDelete, { orderNo });
}

function cityListApi() {
  return get(Api.CityList);
}

export { batchDeleteApi, singleDeleteApi, cityListApi };
