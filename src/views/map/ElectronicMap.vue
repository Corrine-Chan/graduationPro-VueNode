<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <el-card>
        <MapContainer />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="des">
        <div>1.累计充电站数量：<el-text type="primary">34个</el-text></div>
        <div>
          2.单省份最多充电桩：<el-text type="primary">北京(4个)</el-text>
        </div>
        <div>3.充电站遍及省份：<el-text type="primary">14个</el-text></div>
        <div>4.暂无充电站省份：<el-text type="primary">22个</el-text></div>
        <div>5.累计充电站：<el-text type="primary">北京(4个)</el-text></div>
        <div>
          6.单日营收最高：<el-text type="primary">北京西单充电站</el-text>
        </div>
        <div>
          7.单日营收最低：<el-text type="primary">南宁青秀山充电站</el-text>
        </div>
        <div>
          8.故障率最高：<el-text type="primary">兰州黄河桥充电站</el-text>
        </div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h3>新增站点地图</h3>
          </div>
        </template>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          style="max-width: 600px"
          label-width="85px"
        >
          <el-form-item label="站点名称" prop="name">
            <el-input
              placeholder="请输入站点名称"
              v-model="form.name"
              clearable
            />
          </el-form-item>
          <el-form-item label="站点地址" prop="region">
            <el-input
              placeholder="请输入站点地址"
              v-model="form.region"
              clearable
            />
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input
              placeholder="请输入经度 (如: 116.404)"
              v-model.number="form.longitude"
              clearable
            />
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input
              placeholder="请输入纬度 (如: 39.915)"
              v-model.number="form.latitude"
              clearable
            />
          </el-form-item>
          <el-form-item label="立即使用">
            <el-switch v-model="form.isActive" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              placeholder="请输入备注信息"
              type="textarea"
              :rows="3"
              v-model="form.remarks"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="loading">
              创建站点
            </el-button>
            <el-button @click="handleReset">清空</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import MapContainer from "@/components/map/MapContainer.vue";
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { createStationApi } from "@/api/map";
import type { StationFormData, CreateStationParams } from "@/types/station";
import { useUserStore } from "@/store/auth";

const userStore = useUserStore();
const formRef = ref<FormInstance>();
const loading = ref(false);

// 表单数据
const form = reactive<StationFormData>({
  name: "",
  region: "",
  longitude: 0,
  latitude: 0,
  isActive: false,
  remarks: "",
});

// 经纬度验证函数
const validateLongitude = (_: any, value: number, callback: any) => {
  if (!value && value !== 0) {
    callback(new Error("请输入经度"));
  } else if (value < -180 || value > 180) {
    callback(new Error("经度范围应在-180到180之间"));
  } else {
    callback();
  }
};

const validateLatitude = (_: any, value: number, callback: any) => {
  if (!value && value !== 0) {
    callback(new Error("请输入纬度"));
  } else if (value < -90 || value > 90) {
    callback(new Error("纬度范围应在-90到90之间"));
  } else {
    callback();
  }
};

// 表单验证规则
const rules = reactive<FormRules<StationFormData>>({
  name: [
    { required: true, message: "请输入站点名称", trigger: "blur" },
    { min: 2, max: 50, message: "站点名称长度在2到50个字符", trigger: "blur" },
  ],
  region: [
    { required: true, message: "请输入站点地址", trigger: "blur" },
    {
      min: 5,
      max: 100,
      message: "站点地址长度在5到100个字符",
      trigger: "blur",
    },
  ],
  longitude: [
    { required: true, validator: validateLongitude, trigger: "blur" },
  ],
  latitude: [{ required: true, validator: validateLatitude, trigger: "blur" }],
});

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    // 表单验证
    await formRef.value.validate();

    loading.value = true;

    // 构建请求参数
    const now = new Date();
    const createTime = `${now.getFullYear()}年${(now.getMonth() + 1).toString().padStart(2, "0")}月${now.getDate().toString().padStart(2, "0")}日 ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    const params: CreateStationParams = {
      ...form,
      createTime: createTime,
      operator: userStore.username || "系统管理员",
    };

    // 调用API
    await createStationApi(params);

    ElMessage.success("站点创建成功！");

    // 重置表单
    handleReset();
  } catch (error: any) {
    console.error("创建站点失败:", error);
    ElMessage.error(error.message || "创建站点失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 重置表单
const handleReset = () => {
  if (!formRef.value) return;

  formRef.value.resetFields();

  // 手动重置数据
  Object.assign(form, {
    name: "",
    region: "",
    longitude: 0,
    latitude: 0,
    isActive: false,
    remarks: "",
  });
};
</script>

<style scoped>
.des {
  line-height: 35px;
}
</style>
