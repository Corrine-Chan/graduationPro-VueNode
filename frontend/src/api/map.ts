import { post, get } from "@/utils/http";
import type { CreateStationParams } from "@/types/station";

const Api = {
  MapList: "/api/map/mapList",
  CreateStation: "/api/map/create",
  MapStats: "/api/map/stats",
};

function mapListApi() {
  return post(Api.MapList);
}

function createStationApi(data: CreateStationParams) {
  return post(Api.CreateStation, data);
}

function mapStatsApi() {
  return get(Api.MapStats);
}

export { mapListApi, createStationApi, mapStatsApi };
