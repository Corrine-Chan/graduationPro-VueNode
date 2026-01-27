<template>
    <el-dialog :model-value="dialogVisible" :title="title" @close="handleCancel" destroy-on-close>
        <el-form label-width="120" :rules="rules" :model="ruleForm" ref="formRef">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="站点名称：" prop="name">
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
                    <el-form-item label="站点id：" prop="id">
                        <el-input v-model="ruleForm.id" :disabled="disabled" />
                    </el-form-item>
                    <el-form-item label="所属城市：" prop="city">
                        <el-input v-model="ruleForm.city" />
                    </el-form-item>
                    <el-form-item label="站点负责人：" prop="person">
                        <el-input v-model="ruleForm.person" />
                    </el-form-item>
                    <el-form-item label="负责人电话：" prop="tel">
                        <el-input v-model="ruleForm.tel" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="快充数：" prop="fast">
                        <el-input v-model="ruleForm.fast" />
                    </el-form-item>
                    <el-form-item label="慢充数：" prop="slow">
                        <el-input v-model="ruleForm.slow" />
                    </el-form-item>
                    <el-form-item label="充电站状态：" prop="status">
                        <el-select placeholder="充电站状态" v-model="ruleForm.status" :disabled="disabled">
                            <el-option label="全部" :value="1"></el-option>
                            <el-option label="使用中" :value="2"></el-option>
                            <el-option label="空闲中" :value="3"></el-option>
                            <el-option label="维护中" :value="4"></el-option>
                            <el-option label="待维修" :value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="正在充电：" prop="now">
                        <el-input v-model="ruleForm.now" :disabled="disabled" />
                    </el-form-item>
                    <el-form-item label="故障数：" prop="fault">
                        <el-input v-model="ruleForm.fault" :disabled="disabled" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormRules, FormInstance } from "element-plus";
import type { RowType } from "@/types/station";
import { useStationStore } from "@/store/station";
import { storeToRefs } from "pinia";
import { editApi } from "@/api/chargingstation";
import { ElMessage } from "element-plus";

const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true,
    },
});

// 用emit使父组件去更改数据 在父组件身上定义close和reload
const emit = defineEmits(["close", "reload"]);
const ruleForm = ref<RowType>({
    name: "",
    id: "",
    city: "",
    fast: "",
    slow: "",
    status: 1,
    now: "",
    fault: "",
    person: "",
    tel: "",
});
const rules = reactive<FormRules<RowType>>({
    name: [{ required: true, message: "站点名称不能为空", trigger: "blur" }],
    id: [{ required: true, message: "站点id不能为空", trigger: "blur" }],
    city: [{ required: true, message: "所属城市不能为空", trigger: "blur" }],
    person: [{ required: true, message: "站点负责人不能为空", trigger: "blur" }],
    tel: [{ required: true, message: "负责人电话不能为空", trigger: "blur" }],
    fast: [{ required: true, message: "快充数不能为空", trigger: "blur" }],
    slow: [{ required: true, message: "慢充数不能为空", trigger: "blur" }],
    status: [{ required: true, message: "充电状态不能为空", trigger: "blur" }],
    now: [{ required: true, message: "正在充电数不能为空", trigger: "blur" }],
    fault: [{ required: true, message: "故障数不能为空", trigger: "blur" }],
}); // 跟Loign一样再套一个类型

const stationStore = useStationStore();
const { rowData } = storeToRefs(stationStore); // 为了不丢失rowData的响应式

const title = ref<string>("");
// 监听一下弹窗的显示与隐藏
watch(
    () => props.dialogVisible,
    () => {
        if (rowData.value.name) {
            // 判断 如果传的值中其中一项如name有值，那么就是编辑
            title.value = "编辑充电站信息";
            disabled.value = true; // 当弹窗出现时改为true
        } else {
            // 否则读不到值就是新增
            title.value = "新增充电站信息";
            disabled.value = false; // 不禁用
        }

        ruleForm.value = rowData.value;
    }
);

// 禁用
const disabled = ref<boolean>(false);
const handleCancel = () => {
    // 通知父组件让父组件把值改了 子组件没有资格去修改属性
    emit("close");
};

// 确认提交 校验规则
const formRef = ref<FormInstance>();
const handleConfirm = () => {
    formRef.value?.validate(async (valid: boolean) => {
        if (valid) {
            const res = await editApi(ruleForm.value);
            console.log(res);
            if (res.code == 200) {
                ElMessage({
                    message: res.data,
                    type: "success",
                });
                handleCancel();
                emit("reload");
            }
        }
    });
};
</script>
