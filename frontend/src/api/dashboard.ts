// 专门放数据看板的api
import { get } from "@/utils/http";
const Api = {
  ChartData: "/api/dashboard/chartData",
  ChartData2: "/api/dashboard/chartData2",
  ChartData3: "/api/dashboard/chartData3",
};
function chartDataApi() {
  return get(Api.ChartData);
}
function chartDataApi2() {
  return get(Api.ChartData2);
}
function chartDataApi3() {
  return get(Api.ChartData3);
}
export { chartDataApi, chartDataApi2, chartDataApi3 };
