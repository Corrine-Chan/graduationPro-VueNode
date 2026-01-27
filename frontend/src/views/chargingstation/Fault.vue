<template>
  <!-- 充电桩管理 -->
  <el-card>
    <el-select
      style="width: 300px"
      placeholder="选择站点名称"
      v-model="value"
      filterable
    >
      <!-- three： -->
      <el-option
        v-for="item in options"
        :key="item.id"
        :value="item.name"
        :label="item.name"
      ></el-option>
    </el-select>
  </el-card>
  <el-card class="mt">
    <el-radio-group size="large" v-model="radio" @change="handleChange">
      <el-radio-button :label="`全部(${allCount})`" :value="0" />
      <el-radio-button :label="`空闲中(${checkCount(1)})`" :value="1" />
      <el-radio-button :label="`充电中(${checkCount(2)})`" :value="2" />
      <el-radio-button :label="`连接中(${checkCount(3)})`" :value="3" />
      <el-radio-button :label="`排队中(${checkCount(4)})`" :value="4" />
      <el-radio-button :label="`已预约(${checkCount(5)})`" :value="5" />
      <el-radio-button :label="`故障/离线(${checkCount(6)})`" :value="6" />
    </el-radio-group>
  </el-card>
  <el-card class="mt">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in dataListCopy" :key="item.id">
        <div class="item">
          <div class="pic">
            <p v-if="item.status === 1">空闲中</p>
            <p v-else-if="item.status === 2">充电中</p>
            <p v-else-if="item.status === 3">连接中</p>
            <p v-else-if="item.status === 4">排队中</p>
            <p v-else-if="item.status === 5">已预约</p>
            <p v-else-if="item.status === 6">故障/离线</p>
            <img
              :src="item.status == 1 ? free : item.status == 6 ? outline : ing"
              width="100px"
            />
            <p v-if="item.status == 2">{{ item.percent }}</p>
            <p v-else>0%</p>
          </div>
          <div class="info">
            <h3>{{ item.id }}</h3>
            <hr class="mb" />
            <p>电压：{{ item.voltage }}</p>
            <p>电流：{{ item.current }}</p>
            <p>功率：{{ item.power }}</p>
            <p>温度：{{ item.tem }}</p>
          </div>
        </div>
        <div class="btn">
          <div class="divider">
            <div>
              <div>
                <p class="fl ml">暂无预警</p>
                <div class="fr" style="text-align: right">
                  <el-button size="small">维修记录 </el-button>
                  <el-popover placement="right" :width="300" trigger="click">
                    <template #reference>
                      <el-button size="small" type="primary" class="mr"
                        >使用记录</el-button
                      >
                    </template>
                    <h3 class="mb">使用记录</h3>
                    <el-timeline style="max-width: 600px">
                      <el-timeline-item
                        :timestamp="j.time"
                        v-for="j in item.record"
                        :key="j.time"
                        type="primary"
                        hollow
                      >
                        {{ j.msg }}
                      </el-timeline-item>
                    </el-timeline>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import free from "@/assets/free.png";
import ing from "@/assets/ing.png";
import outline from "@/assets/outline.png";
import { currentListApi } from "@/api/chargingstation";
import { computed, onMounted, ref, watch } from "vue";

// three：不定义类型就直接any 因为可能后端数据类型会变所以不强行定义类型
const options = ref<any>([]); // 下拉菜单数据 所有站点数据的数组
// four：用dataList来存列表数据
const dataList = ref<any>([]); // 列表数据 从始至终到保持不变
// six:备份dataList 防止后端筛选的时候把原来的dataList数据给改了
const dataListCopy = ref<any>([]);

// one：加载数据 异步的
const loadData = async () => {
  const { data } = await currentListApi();
  // console.log(res);
  console.log(data);
  // 不轻易动这个options的数据 因为有模糊查询
  options.value = data; // 把数据给下拉选择框中options的值
  dataList.value = data[0].list; // 默认获取第一个充电站里面的所有充电桩列表
  dataListCopy.value = data[0].list; // 渲染筛选之后的列表数据
};

// two：在挂载完毕后去加载数据
onMounted(() => {
  loadData();
});

// three：
const value = ref<string>("");
// six:给radio初始值为0 默认存储的是全部状态的值
const radio = ref<number>(0);

// four:统计列表dataList中符合某个条件的项的数量
function checkCount(num: number) {
  // 比如说传进来1 看看有几个是为1的
  return dataList.value.filter((item: any) => item.status == num).length;
}

// five:计算函数
const allCount = computed(
  () =>
    checkCount(1) +
    checkCount(2) +
    checkCount(3) +
    checkCount(4) +
    checkCount(5) +
    checkCount(6)
);

// six:筛选
const handleChange = () => {
  // radio的value不为0 也就是不是“全部”的进行筛选
  // 每次筛选都是从全部那里去筛选 而不是紧接着上次的 例如筛选充电中的不要从空闲中筛选
  dataListCopy.value = dataList.value; // 重置数据 每次查询先重置
  if (radio.value != 0) {
    dataListCopy.value = dataListCopy.value.filter(
      (item: any) => item.status == radio.value
    );
  }
};

// seven：
watch(value, () => {
  const res = options.value.filter((item: any) => item.name == value.value);
  console.log(res); // 是选中了该下拉选择框的某选项的数组
  console.log(value.value); // 打印出点击下拉选择框的某选项名称
  dataListCopy.value = res[0].list; // 这个充电站所拥有的所有充电桩
  dataList.value = res[0].list; // 原来默认的也要跟着切换
  radio.value = 0; // 重置为0 默认显示所有状态的充电桩
});
</script>

<style lang="less" scoped>
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: rgb(247, 251, 254);
  padding: 10px;
  border-radius: 10px 10px 0 0;
  margin-top: 20px;
  .pic {
    p {
      width: 76px;
      text-align: center;
      margin-bottom: 10px;
      color: rgb(32, 184, 91);
    }
  }
  .info {
    color: #999;
    margin-left: 30px;
    line-height: 26px;
    margin-top: -10px;
  }
}
.btn {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #f7fbfe;
  .divider {
    background-color: #f4f4f4;
    height: 2px;
    width: 95%;
    margin: auto;
  }
}
</style>
