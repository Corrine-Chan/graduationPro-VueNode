// 后续还会用到这个类型 所以设置成单独的文件
interface MenuItem{
    name: string,
    icon: string,
    url: string,
    children?:MenuItem[] // 因为children是可选的 所以给个问号
}
export type{MenuItem}