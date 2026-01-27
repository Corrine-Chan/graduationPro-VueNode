import { post } from "@/utils/http"

// 采用ts的枚举,把项目中的所有接口都用变量定义一下
// 但是这里用enum会报错
const Api = {
    Login: "/login"
};

// data也定义一下类型
interface LoginParams{
    username: string,
    password:string
}

function loginApi(data:LoginParams): Promise<any>{
    return post(Api.Login,data)
}

// 不用默认导出是因为 默认导出只能导一个 未来会有好多个接口 
export {loginApi}