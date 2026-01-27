import service from "./axios";
interface ResponseData{
    // 通过 ResponseData 接口定义了所有响应数据的结构
    code: number,
    data: any,
    message:string
}

// Promise有个泛型 返回 Promise泛型确保TypeScript 知道返回的数据结构
function get(url: string, params?: any):Promise<ResponseData> {
    return service.get(url,{params})
}
function post(url: string, data?: any): Promise<ResponseData>{
    return service.post(url,data) // 这里是axios中的语法
}

export {get,post}