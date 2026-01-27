import { post } from "@/utils/http";
import { onMounted, reactive, ref, unref } from "vue";

// 接收两个泛型 一个是初始参数定义的泛型 一个是表格数据定义的泛型
export function useHttp<T>(url: string, initialParams: any) {
  const dataList = ref<T[]>([]); //存储表格数据
  const loading = ref<boolean>(false);
  const totals = ref<number>(0); //存储总条数
  const pageInfo = reactive({
    page: 1,
    pageSize: 10,
  });
  const loadData = async () => {
    loading.value = true;
    try {
      const {
        data: { list, total },
      } = await post(url, { ...unref(initialParams), ...pageInfo });
      dataList.value = list;
      totals.value = total;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  onMounted(() => {
    loadData();
  });
  // 直接copy usePagination.ts 中的
  const handleSizeChange = (size: number) => {
    pageInfo.pageSize = size;
    loadData();
  };
  const handleCurrentChange = (page: number) => {
    pageInfo.page = page;
    loadData();
  };
  // 重置
  const resetPagination = () => {
    pageInfo.page = 1;
    pageInfo.pageSize = 10;
    loadData();
  };
  return {
    dataList,
    loading,
    totals,
    pageInfo,
    loadData,
    handleSizeChange,
    handleCurrentChange,
    resetPagination,
  };
}
