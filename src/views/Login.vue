<template>
    <div class="bg">
        <div class="login">
            <div class="logo">
                <img :src="logo" alt="" width="70px" height="70px" />
                <h1>绿闪桩能源管理平台</h1>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="formRef" class="login-form">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" class="custom-input" placeholder="请输入用户名" prefix-icon="User" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" class="custom-input" placeholder="请输入密码" prefix-icon="Lock" type="password" />
                </el-form-item>
                <el-form-item class="btn-container">
                    <el-button class="login-btn" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup lang="ts">
import logo from "@/assets/logo.png"; // 把图片模块化防止路径改变找不到
import { reactive, ref } from "vue";
import type { FormRules, FormInstance } from "element-plus";
import { useUserStore } from "@/store/auth";
import { useRouter } from "vue-router";
//用接口去标注一个reactive变量的类型 所以这个类型是RuleForm
interface RuleForm {
    username: string;
    password: string;
}
const ruleForm: RuleForm = reactive({
    username: "",
    password: "",
});
// 泛型FormRules
const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: "用户名不能为空", trigger: "blur" },
        { min: 6, max: 11, message: "用户名要求6-11位数字字母组合", trigger: "blur" },
    ],
    password: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        { pattern: /^\d{6}$/, message: "密码必须是6位纯数字", trigger: "blur" },
    ],
});

//  这里ref用泛型
const formRef = ref<FormInstance>();
const userStore = useUserStore(); // 这里可以解构赋值
const router = useRouter();
const handleLogin = () => {
    formRef.value?.validate(async (valid: boolean) => {
        // ?.可选链操作符 就跟三目运算一样 例如obj?obj.name:"" 只会在obj不为空undefined才会去读取name
        // console.log(valid); // valid是看表单是否通过
        if (valid) {
            await userStore.login(ruleForm); // 这里能用await是因为login也是一个异步函数
            router.push("/");
        }
    });
};
</script>

<style lang="less" scoped>
.bg {
    background-image: url("../assets/bg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    display: flex;
    align-items: center; // 垂直居中
    justify-content: center;
    .login {
        width: 420px;
        height: auto;
        padding: 32px;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        text-align: center;
        position: absolute;
        top: 50%;
        margin-top: -175px;
        left: 7%;

        .logo {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            h1 {
                color: rgb(84, 141, 24);
            }
        }

        .login-form {
            display: flex;
            flex-direction: column;
            height: auto;
            align-items: center;
            // height: calc(100% - 100px);

            :deep(.el-form-item) {
                margin-bottom: 20px;
                width: 90%;
            }
        }

        // Vue的深度选择器(Deep Selector)
        // 在Vue中使用scoped样式时默认只会应用到当前组件的元素上不会影响子组件
        // :deep()选择器允许样式穿透到子组件内部
        :deep(.custom-input) {
            .el-input__wrapper {
                font-size: 16px;
                margin-bottom: 10px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                box-shadow: none !important;
                padding: 0 15px;
                transition: all 0.3s ease;

                &.is-focus {
                    box-shadow: 0 0 0 1px rgba(166, 201, 51, 0.5) !important;
                    border-color: rgba(84, 141, 24, 0.8);
                }
            }

            .el-input__inner {
                color: #333;
                padding-left: 8px; /* 添加文字与图标的间距 */
                &::placeholder {
                    color: rgba(0, 0, 0, 0.5);
                }
            }

            /* 增大图标尺寸并添加间距 */
            .el-input__prefix-inner {
                margin-right: 5px;
                .el-icon {
                    font-size: 18px; /* 增大图标尺寸 */
                }
            }
        }

        .btn-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            margin-left: 26%;
        }

        .login-btn {
            font-size: 16px;
            height: 40px;
            width: 70%;
            background-color: rgb(84, 141, 24);
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 10px;
            transition: all 0.3s ease;
            &:hover {
                background-color: rgba(166, 201, 51, 0.8);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(166, 201, 51, 0.3);
            }
        }
    }
}
</style>
