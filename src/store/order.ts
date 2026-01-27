import { defineStore } from "pinia";
import { ref } from "vue";

// 订单详情数据类型
interface OrderDetail {
  orderNo: string;
  equipmentNo: string;
  date: string;
  stationName: string;
  endTime: string;
  amount: number;
  payMethod: string;
  city: string;
  chargeAmount: number;
  chargeDevice: string;
  chargeDuration: number;
  managerName: string;
  managerPhone: string;
  maintainerName: string;
  maintainerPhone: string;
  status: string;
  serviceFee: number;
  parkingFee: number;
  electricityFee: number;
  feeInfo: string;
  remarks: string;
}

export const useOrderStore = defineStore("order", () => {
  // 当前选中的订单编号
  const currentOrderNo = ref<string>("");

  // 当前订单详情数据
  const currentOrderDetail = ref<OrderDetail | null>(null);

  // 设置当前订单编号
  const setCurrentOrderNo = (orderNo: string) => {
    currentOrderNo.value = orderNo;
  };

  // 设置当前订单详情
  const setCurrentOrderDetail = (detail: OrderDetail) => {
    currentOrderDetail.value = detail;
    currentOrderNo.value = detail.orderNo;
  };

  // 清空订单信息
  const clearOrderInfo = () => {
    currentOrderNo.value = "";
    currentOrderDetail.value = null;
  };

  // 获取当前订单编号
  const getCurrentOrderNo = () => {
    return currentOrderNo.value;
  };

  return {
    currentOrderNo,
    currentOrderDetail,
    setCurrentOrderNo,
    setCurrentOrderDetail,
    clearOrderInfo,
    getCurrentOrderNo,
  };
});
