<template>
  <div class="bg">
    <div class="auth-card">
      <div class="logo">
        <img :src="logo" alt="" width="70px" height="70px" />
        <h1>绿闪桩能源管理平台</h1>
      </div>

      <!-- 切换标签 -->
      <div class="tabs">
        <div :class="['tab', { active: isLogin }]" @click="switchToLogin">
          登录
        </div>
        <div :class="['tab', { active: !isLogin }]" @click="switchToRegister">
          注册
        </div>
      </div>

      <!-- 登录表单 -->
      <el-form
        v-show="isLogin"
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        class="auth-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            class="custom-input"
            placeholder="请输入用户名（6-20位）"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            class="custom-input"
            placeholder="请输入密码（6-20位数字或字母数字组合）"
            prefix-icon="Lock"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captcha"
              class="custom-input captcha-input"
              placeholder="请输入验证码"
              prefix-icon="Picture"
            />
            <div class="captcha-code" @click="refreshCaptcha">
              {{ captchaText }}
            </div>
          </div>
        </el-form-item>
        <div class="form-options">
          <el-checkbox v-model="rememberMe" label="记住我" />
          <span class="forgot-password" @click="handleForgotPassword"
            >忘记密码？</span
          >
        </div>
        <el-form-item class="btn-container">
          <el-button class="auth-btn" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-show="!isLogin"
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormRef"
        class="auth-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            class="custom-input"
            placeholder="请输入用户名（6-20位）"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            class="custom-input"
            placeholder="请输入密码（6-20位数字或字母数字组合）"
            prefix-icon="Lock"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            class="custom-input"
            placeholder="请确认密码"
            prefix-icon="Lock"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item prop="department">
          <el-select
            v-model="registerForm.department"
            class="custom-select"
            placeholder="请选择所属部门"
            style="width: 100%"
          >
            <el-option label="总经办" value="总经办" />
            <el-option label="运营部" value="运营部" />
            <el-option label="技术部" value="技术部" />
            <el-option label="市场部" value="市场部" />
            <el-option label="财务部" value="财务部" />
            <el-option label="维修部" value="维修部" />
            <el-option label="客服部" value="客服部" />
          </el-select>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input
              v-model="registerForm.captcha"
              class="custom-input captcha-input"
              placeholder="请输入验证码"
              prefix-icon="Picture"
            />
            <div class="captcha-code" @click="refreshCaptcha">
              {{ captchaText }}
            </div>
          </div>
        </el-form-item>
        <el-form-item class="btn-container">
          <el-button class="auth-btn" @click="handleRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import logo from "@/assets/logo.png";
import { reactive, ref } from "vue";
import type { FormRules, FormInstance } from "element-plus";
import { useUserStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

// 登录表单类型
interface LoginForm {
  username: string;
  password: string;
  captcha: string;
}

// 注册表单类型
interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  department: string;
  captcha: string;
}

// 状态管理
const isLogin = ref(true);
const rememberMe = ref(false);
const captchaText = ref("");

// 登录表单
const loginForm: LoginForm = reactive({
  username: "",
  password: "",
  captcha: "",
});

// 注册表单
const registerForm: RegisterForm = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  department: "",
  captcha: "",
});

// 验证确认密码
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};

// 验证验证码
const validateCaptcha = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else if (value.toLowerCase() !== captchaText.value.toLowerCase()) {
    callback(new Error("验证码错误"));
  } else {
    callback();
  }
};

// 登录表单验证规则
const loginRules = reactive<FormRules<LoginForm>>({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "用户名要求6-20位",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "密码长度为6-20位",
      trigger: "blur",
    },
    {
      pattern: /^(?:\d{6,20}|[a-zA-Z]+\d+|\d+[a-zA-Z]+|[a-zA-Z\d]{6,20})$/,
      message: "密码必须是6位以上纯数字或字母数字组合",
      trigger: "blur",
    },
  ],
  captcha: [{ validator: validateCaptcha, trigger: "blur" }],
});

// 注册表单验证规则
const registerRules = reactive<FormRules<RegisterForm>>({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "用户名要求6-20位",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "密码长度为6-20位",
      trigger: "blur",
    },
    {
      pattern: /^(?:\d{6,20}|[a-zA-Z]+\d+|\d+[a-zA-Z]+|[a-zA-Z\d]{6,20})$/,
      message: "密码必须是6位以上纯数字或字母数字组合",
      trigger: "blur",
    },
  ],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
  department: [
    { required: true, message: "请选择所属部门", trigger: "change" },
  ],
  captcha: [{ validator: validateCaptcha, trigger: "blur" }],
});

const loginFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();
const userStore = useUserStore();
const router = useRouter();

// 生成随机验证码
const generateCaptcha = () => {
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// 刷新验证码
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha();
};

// 初始化验证码
refreshCaptcha();

// 切换到登录
const switchToLogin = () => {
  isLogin.value = true;
  loginFormRef.value?.resetFields();
  refreshCaptcha();
};

// 切换到注册
const switchToRegister = () => {
  isLogin.value = false;
  registerFormRef.value?.resetFields();
  refreshCaptcha();
};

// 处理登录
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await userStore.login({
          username: loginForm.username,
          password: loginForm.password,
        });

        // 如果选择记住我，只保存用户名到本地存储
        if (rememberMe.value) {
          localStorage.setItem("rememberedUsername", loginForm.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        ElMessage({
          message: "登录成功",
          type: "success",
          duration: 3000, // 显示3秒
        });
        router.push("/dashboard");
      } catch (error: any) {
        console.error("登录错误:", error);

        // 获取错误信息
        let errorMessage = "登录失败，请重试";

        if (error?.response?.data?.message) {
          // 后端返回的错误信息
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          // 网络错误等
          errorMessage = error.message;
        }

        ElMessage({
          message: errorMessage,
          type: "error",
          duration: 4000, // 显示4秒
        });

        // 延迟刷新验证码，让用户有时间看到错误信息
        setTimeout(() => {
          refreshCaptcha();
        }, 2000);
      }
    }
  });
};

// 处理注册
const handleRegister = () => {
  registerFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await userStore.register({
          username: registerForm.username,
          password: registerForm.password,
          department: registerForm.department,
        });
        ElMessage({
          message: "注册成功，请登录",
          type: "success",
          duration: 3000, // 显示3秒
        });
        switchToLogin();
      } catch (error) {
        ElMessage({
          message: "注册失败，请重试",
          type: "error",
          duration: 4000, // 显示4秒
        });
        // 延迟刷新验证码
        setTimeout(() => {
          refreshCaptcha();
        }, 2000);
      }
    }
  });
};

// 处理忘记密码
const handleForgotPassword = () => {
  ElMessage({
    message: "请联系管理员重置密码",
    type: "info",
    duration: 4000, // 显示4秒
  });
  // TODO: 后续可以实现找回密码功能
};

// 页面加载时检查是否有记住的用户名
const loadRememberedCredentials = () => {
  const username = localStorage.getItem("rememberedUsername");
  if (username) {
    loginForm.username = username;
    rememberMe.value = true;
  }
};

loadRememberedCredentials();
</script>

<style lang="less" scoped>
.bg {
  background-image: url("../assets/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .auth-card {
    width: 450px;
    height: auto;
    padding: 40px;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 7%;

    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 25px;
      h1 {
        color: rgb(84, 141, 24);
        font-size: 24px;
      }
    }

    .tabs {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
      gap: 10px;

      .tab {
        flex: 1;
        padding: 12px 0;
        cursor: pointer;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.2);
        color: rgba(0, 0, 0, 0.6);
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        &.active {
          background: rgb(84, 141, 24);
          color: white;
          box-shadow: 0 4px 12px rgba(84, 141, 24, 0.3);
        }
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      align-items: center;

      :deep(.el-form-item) {
        margin-bottom: 20px;
        width: 100%;
      }

      :deep(.custom-input) {
        .el-input__wrapper {
          font-size: 16px;
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
          padding-left: 8px;
          &::placeholder {
            color: rgba(0, 0, 0, 0.5);
          }
        }

        .el-input__prefix-inner {
          margin-right: 5px;
          .el-icon {
            font-size: 18px;
          }
        }
      }

      :deep(.custom-select) {
        .el-select__wrapper {
          font-size: 16px;
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

        .el-select__placeholder {
          color: rgba(0, 0, 0, 0.5) !important;
        }

        .el-select__selected-item {
          color: #333;
        }
      }

      .captcha-container {
        display: flex;
        gap: 10px;
        width: 100%;

        .captcha-input {
          flex: 1;
        }

        .captcha-code {
          width: 100px;
          height: 40px;
          background: rgba(84, 141, 24, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: rgb(84, 141, 24);
          letter-spacing: 5px;
          cursor: pointer;
          user-select: none;
          transition: all 0.3s ease;
          border: 1px solid rgba(84, 141, 24, 0.3);

          &:hover {
            background: rgba(84, 141, 24, 0.3);
            transform: scale(1.05);
          }
        }
      }

      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 10px;

        :deep(.el-checkbox) {
          .el-checkbox__label {
            color: rgba(0, 0, 0, 0.7);
            font-size: 14px;
          }
        }

        .forgot-password {
          color: rgb(84, 141, 24);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            color: rgba(166, 201, 51, 0.8);
            text-decoration: underline;
          }
        }
      }

      .btn-container {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        width: 100%;
      }

      .auth-btn {
        font-size: 16px;
        height: 45px;
        width: 100%;
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
}
</style>
