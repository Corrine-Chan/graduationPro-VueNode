<template>
  <!-- 计费管理 -->
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card>
        <el-input
          style="width: 80%"
          placeholder="请输入关键词"
          v-model.trim="filterText"
        >
          <template #append>
            <el-button icon="Search" />
          </template>
        </el-input>
        <el-tree
          ref="treeRef"
          :data="treeData"
          style="max-width: 600px"
          :props="defaultProps"
          class="mt"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="card-header">
            <h3>{{ title }}：计费模板</h3>
          </div>
        </template>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
        >
          <el-form-item label="模板名称：" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入模板名称"
              style="max-width: 200px"
              :disabled="!title"
            />
          </el-form-item>
          <el-form-item
            :label="'时间区间' + (index + 1) + '：'"
            v-for="(timeSlot, index) in ruleForm.date"
            :key="index"
          >
            <el-col :span="8">
              <el-form-item
                label="开始时间"
                :prop="`date.${index}.date1`"
                :rules="[
                  {
                    required: true,
                    message: '时间不能为空，请选择开始时间',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-time-picker
                  value-format="hh:mm:ss"
                  v-model="timeSlot.date1"
                  placeholder="选择开始时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <span>--</span>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="结束时间"
                :prop="`date.${index}.date2`"
                :rules="[
                  {
                    required: true,
                    message: '时间不能为空，请选择结束时间',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-time-picker
                  value-format="hh:mm:ss"
                  v-model="timeSlot.date2"
                  placeholder="选择结束时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="电费："
                :prop="`date.${index}.electricity`"
                :rules="[
                  {
                    required: true,
                    message: '电费不能为空，请输入电费',
                    trigger: 'blur',
                  },
                  { pattern: /^\d+(\.\d+)?$/, message: '必须是数字' },
                ]"
              >
                <el-input
                  v-model="timeSlot.electricity"
                  placeholder="请输入电费"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-button type="primary" class="mb" @click="addTimeSlot"
            >添加时间区间</el-button
          >
          <el-form-item label="服务费：" prop="service">
            <el-input v-model="ruleForm.service" style="max-width: 200px" />
          </el-form-item>
          <el-form-item label="停车费：" prop="parking">
            <el-input v-model="ruleForm.parking" style="max-width: 200px" />
          </el-form-item>
          <el-form-item label="特殊备注：" prop="remarks">
            <el-input v-model="ruleForm.remarks" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">创建</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { cityListApi } from "@/api/operation";
import { onMounted, reactive, ref, watch } from "vue";
// element-plus 中 el-tree 组件的实例类型
import type { TreeInstance } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 树形控件
// 定义树形图的数据类型
interface Tree {
  label: string;
  children?: Tree[]; // children是可选的，因为有些可能没有子节点
}

// 定义表单类型
interface RuleFormType {
  name: string;
  service: string;
  parking: string;
  remarks: string;
  date: Array<{ date1: string; date2: string; electricity: string }>;
}

const filterText = ref<string>("");
const treeRef = ref<TreeInstance>();

// 监听表单的filterText
watch(filterText, (val) => {
  treeRef.value!.filter(val); // 非空断言，表面开发者确定treeRef.value在这个位置是有效的，不是null 或 undefined
});

const defaultProps = {
  children: "children",
  label: "label",
};

const treeData = ref<Tree[]>([]);

onMounted(async () => {
  const { data } = await cityListApi(); // 调用接口并且解构赋值
  //   console.log(res); // 打印出来数据存在了data中 可以解构赋值出来
  treeData.value = data; // treeData树形信息就是接口返回的data
});

const filterNode = (value: string, data: Tree) => {
  console.log(value, data);
  if (!value) return true;
  return data.label.includes(value);
};

// 计费模板
const title = ref<string>("");
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<RuleFormType>>({
  name: [
    {
      required: true,
      message: "请输入模板名称",
      trigger: "blur",
    },
  ],
  service: [
    {
      required: true,
      message: "请输入服务费",
      trigger: "blur",
    },
  ],
  parking: [
    {
      required: true,
      message: "请输入停车费",
      trigger: "blur",
    },
  ],
  remarks: [
    {
      required: true,
      message: "请输入备注",
      trigger: "blur",
    },
  ],
});

const ruleForm = ref<RuleFormType>({
  name: "",
  service: "",
  parking: "",
  remarks: "",
  date: [{ date1: "", date2: "", electricity: "" }],
});
// 多添加一组时间选择+电费输入
const addTimeSlot = () => {
  ruleForm.value.date.push({ date1: "", date2: "", electricity: "" });
};
const submitForm = () => {
  // ruleFormRef 表单对象
  ruleFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log("校验通过！创建成功！");
      console.log(ruleForm.value);
      // 将数据发送到后端
    }
  });
};

const handleNodeClick = (data: Tree) => {
  // console.log(data); // data就是所选的数据
  if (!data.children) {
    title.value = data.label; // 标题就等于所选项的label
    resetForm(); // 切换的时候调用重置功能
  }
};
// 重置
const resetForm = () => {
  ruleForm.value = {
    name: "",
    service: "",
    parking: "",
    remarks: "",
    date: [{ date1: "", date2: "", electricity: "" }],
  };
};
</script>
