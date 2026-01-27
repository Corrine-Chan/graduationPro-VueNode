// 自定义指令配置项
import { useUserStore } from "@/store/auth";
import type { Directive } from "vue";

const permission: Directive = {
  beforeMount(el: any, binding: any) {
    const userStore = useUserStore();
    const { roles } = userStore; // 解构出角色
    const requirePermission = binding.value; // requirePermission所需要的权限
    // 看包不包含后面所需要的这个权限
    if (!roles.includes(requirePermission)) {
      // 不包含要把元素给它隐藏了
      el.style.display = "none";
    }
  },
};

export default permission;
