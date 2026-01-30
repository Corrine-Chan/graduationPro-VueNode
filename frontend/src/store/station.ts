import { defineStore } from "pinia";
import { ref } from "vue";
import type { RowType } from "@/types/station";
export const useStationStore = defineStore("station", () => {
  const rowData = ref<RowType>({
    name: "",
    id: "",
    city: "",
    fast: "",
    slow: "",
    status: 2, // 默认状态改为2（使用中）
    now: "",
    fault: "",
    person: "",
    tel: "",
  });
  const setRowData = (row: RowType) => {
    rowData.value = row;
  };
  return {
    rowData,
    setRowData,
  };
});
