import { get } from "@/utils/http";

const Api = {
  AlarmList: "/alarmList",
};

function alarmListApi() {
  return get(Api.AlarmList);
}

export { alarmListApi };
