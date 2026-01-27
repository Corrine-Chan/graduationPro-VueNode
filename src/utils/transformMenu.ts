// 把菜单转换成想要的格式 封装成一个工具函数
// nodes就是整个数组 所有的树节点
function transformMenu(nodes: any) {
  return nodes.map((node: any) => {
    const newNode: any = {
      label: node.name,
      url: node.url,
    };
    if (node.children) {
      // 如果有子节点 下面这里要递归 因为不确定有多少个children
      newNode.children = transformMenu(node.children);
    }
    return newNode;
  });
}

export { transformMenu };
