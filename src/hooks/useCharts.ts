import { onBeforeUnmount, onMounted, ref, markRaw } from "vue";
import type { Ref } from "vue";
import * as echarts from "echarts";
// 传入两个参数 一个是容器一个是配置项
export function useChart(chartRef:Ref<HTMLElement | null>,setChartData:any) {
    const chartInstance = ref<echarts.ECharts | null>(null)  // 联合类型
    
    const initChart =async () => {
        if (chartRef.value) {
            // 使用markRaw让它不可能变成响应式
            chartInstance.value = markRaw(echarts.init(chartRef.value))
            const options=await setChartData()
            chartInstance.value.setOption(options)
        }
    }

    const resizeChart = () => {
        chartInstance.value?.resize()
    }
    onMounted(() => {
        initChart()
        window.addEventListener("resize", resizeChart)
    })
    // 在卸载之前  避免内存泄漏  性能优化
    onBeforeUnmount(() => {
        window.addEventListener("resize", resizeChart) // 事件移除
        if (chartInstance.value) {
            chartInstance.value.dispose() // 释放图表实例 图表占用的资源移除
        }
    })

}