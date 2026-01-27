import { post } from "@/utils/http";

const Api = {
  Auth: "/userAuth",
  SetAuth: "/setAuth", //设置权限
  DeleteUser: "/deleteUser", //删除用户
  DisableUser: "/disableUser", //禁用用户
};

function getAuthApi(pageAuthority: string) {
  // 传参 传的是页面权限
  return post(Api.Auth, { pageAuthority });
}

function setAuthApi(account: string, btnList: string[], pageList: string[]) {
  return post(Api.SetAuth, { account, btnList, pageList });
}

function deleteUserApi(account: string) {
  return post(Api.DeleteUser, { account });
}

function disableUserApi(account: string) {
  return post(Api.DisableUser, { account });
}

export { getAuthApi, setAuthApi, deleteUserApi, disableUserApi };
