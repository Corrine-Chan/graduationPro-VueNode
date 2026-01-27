import { get, post } from "@/utils/http";

const Api = {
  TypeList: "/document", // 分类列表
  SubmitArticle: "/document/submit", // 提交文章
};

function typeListApi() {
  return get(Api.TypeList);
}

// 提交文章接口
function submitArticleApi(data: any) {
  return post(Api.SubmitArticle, data);
}

export { typeListApi, submitArticleApi };
