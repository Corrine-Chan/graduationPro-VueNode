<template>
  <div style="max-width: 600px">
    <el-steps :active="currentStep" finish-status="success" align-center>
      <el-step
        v-for="(step, index) in steps"
        :key="index"
        :title="step.title"
      />
    </el-steps>
    <div v-if="currentStep === 0" class="mt">
      <!-- 具名插槽 -->
      <slot name="step-1"></slot>
    </div>
    <div v-if="currentStep === 1" class="mt">
      <slot name="step-2"></slot>
    </div>
    <div v-if="currentStep === 2" class="mt">
      <slot name="step-3"></slot>
    </div>
    <div class="step-buttons">
      <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
      <el-button type="primary" @click="nextStep">
        <!-- 传入的steps数组，数据只有3项，length为3，所以减1就是角标为2 也就是走到最后一步 -->
        {{ currentStep === steps.length - 1 ? "提交" : "下一步" }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 初始值为0 说还没开始 要是为1 说明已经完成第一步
const currentStep = ref<number>(0);

// 子组件通过props来接收下面这些属性数据 下面就是规定这些属性
// 那么父组件Alarm中就有了这些属性 父组件就可以通过下面这些props属性向子组件传递数据
const props = defineProps(["steps", "form1", "form2", "form3"]);

// 子组件发出自定义事件handle-submit 通知父组件进行提交操作
const emit = defineEmits(["handle-submit"]);

// 上一步事件
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 下一步事件
const nextStep = () => {
  // 定义一个数组 把所有表单实例存起来
  const forms = [props.form1, props.form2, props.form3];
  // 可以直接把currentStep.value的值当初forms数组角标 这样就不用很多的else if
  const currentForm = forms[currentStep.value];
  console.log(forms[currentStep.value]);

  // props.form1拿到的第一个表单的实例对象
  currentForm.validate((valid: boolean) => {
    if (valid) {
      // 如果校验通过才执行下面的代码
      // 如果是在最后一项步骤的前面  props是传入的那个steps属性
      if (currentStep.value < props.steps.length - 1) {
        currentStep.value++;
      } else {
        // 调用emit 去触发父组件身上的handle-submit事件
        emit("handle-submit");
        // 如果是最后一项的步骤就提交表单
        console.log("提交表单");
      }
    }
  });
};
</script>
