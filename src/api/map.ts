import { post } from "@/utils/http";
import type { CreateStationParams } from "@/types/station";

const Api = {
  MapList: "/mapList",
  CreateStation: "/station/create",
};

function mapListApi() {
  return post(Api.MapList);
}

function createStationApi(data: CreateStationParams) {
  return post(Api.CreateStation, data);
}

export { mapListApi, createStationApi };
