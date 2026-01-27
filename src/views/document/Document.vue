<template>
  <!-- 招商管理 -->
  <el-card>
    <div class="mt">
      <span class="title">文章类型：</span>
      <!-- 全部这里的点击事件就固定传-1 -->
      <el-tag
        :type="currentIndex[0] === -1 ? 'primary' : 'info'"
        class="mr"
        @click="handleSelect(-1, 0, '')"
        >全部</el-tag
      >
      <!-- 因为item不重复 所以用来当key了 -->
      <el-tag
        :type="currentIndex[0] === index ? 'primary' : 'info'"
        class="mr"
        v-for="(item, index) in typeList.type"
        :key="item"
        @click="handleSelect(index, 0, item)"
        >{{ item }}</el-tag
      >
    </div>
    <div class="mt">
      <span class="title">重要程度：</span>
      <el-tag
        :type="currentIndex[1] === -1 ? 'primary' : 'info'"
        class="mr"
        @click="handleSelect(-1, 1, '')"
        >全部</el-tag
      >
      <el-tag
        :type="currentIndex[1] === index ? 'primary' : 'info'"
        class="mr"
        v-for="(item, index) in typeList.important"
        :key="item"
        @click="handleSelect(index, 1, item)"
        >{{ item }}</el-tag
      >
    </div>
    <div class="mt">
      <span class="title">发布渠道：</span>
      <el-tag
        :type="currentIndex[2] === -1 ? 'primary' : 'info'"
        class="mr"
        @click="handleSelect(-1, 2, '')"
        >全部</el-tag
      >
      <el-tag
        :type="currentIndex[2] === index ? 'primary' : 'info'"
        class="mr"
        v-for="(item, index) in typeList.publish"
        :key="item"
        @click="handleSelect(index, 2, item)"
        >{{ item }}</el-tag
      >
    </div>
    <el-divider />
    <div class="mt">
      <span class="title">已选：</span>
      <el-tag
        type="success"
        class="mr"
        v-for="item in selectList"
        :key="item"
        closable
        @close="handleClose(item.num)"
        disable-transitions
        >{{ item.name }}</el-tag
      >
    </div>
  </el-card>
  <el-button type="primary" class="mt mb" @click="exportToHtml"
    >导出富文本到HTML文件</el-button
  >
  <editor
    v-model="editorContent"
    id="uuid"
    apiKey="a2x5lvyo4il84xm0wuh1l95nnl9pm8urfk3h3uiq1t15b7bn"
    :init="{
      language: 'zh-CN',
      plugins:
        'advlist anchor autolink charmap code fullscreen help image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
      toolbar:
        'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      height: 500,
    }"
  />
  <el-button
    type="primary"
    @click="handleSubmit"
    class="mt"
    :loading="submitLoading"
    :disabled="submitLoading"
  >
    {{ submitLoading ? "提交中..." : "提交文章内容" }}
  </el-button>
</template>

<script setup lang="ts">
import { typeListApi, submitArticleApi } from "@/api/document";
import { onMounted, ref } from "vue";
import Editor from "@tinymce/tinymce-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 定义typeList数据类型
interface ListType {
  type: string[];
  important: string[];
  publish: string[];
}
// 定义已选选项的SelectType类型
interface SelectType {
  name: string;
  num: number;
}

// 用typelist存一下数据
const typeList = ref<ListType>({ type: [], important: [], publish: [] });

onMounted(async () => {
  //   const res = await typeListApi();
  //   console.log(res);
  const { data } = await typeListApi(); // 解构赋值一下
  console.log(data);
  typeList.value = data;
});

const currentIndex = ref([-1, -1, -1]); // 0是默认为招商类  -1则是 后退为全部

// num 就是选的第几个类别 name 就是点击的那个名字
const handleSelect = (index: number, num: number, name: string) => {
  console.log(index, num, name);
  // findIndex 获取指定数组的角标 对数组每一项进行循环去找符合条件的角标 没有找到则返回-1 ind是下标0、1、2
  // ind 只表示：这个分类在selectList 数组里的”当前位置下标“
  const ind: number = selectList.value.findIndex(
    (item: SelectType) => item.num === num,
  );
  console.log(
    "当前点击的分类 num=",
    num,
    "在 selectList 中的位置 ind=",
    ind,
    "当前 selectList=",
    selectList.value,
  );
  if (!name) {
    // 如果要点的是全部，要从已选中删掉对应这个类别的数据 !==num不是对应类别的留下
    selectList.value = selectList.value.filter(
      (item: SelectType) => item.num !== num,
    );
  } else {
    // 如果点的不是全部
    if (ind === -1) {
      // 如果等于-1 说明已选里没有 就可以push
      selectList.value.push({ name, num });
    } else {
      // 如果已选里有的话就替换成 选中的name和num
      selectList.value[ind] = { name, num };
    }
  }

  //   currentIndex.value = index; // 把当前高亮的index给它存起来
  currentIndex.value[num] = index;
};

// 存的是[{name:"招商类",num:0},{name:"二级",num:1},{name:"公众号",num:2}] num就是类别的角标
const selectList = ref<SelectType[]>([]);

const handleClose = (num: number) => {
  // 下面这个过滤就相当于是删除
  selectList.value = selectList.value.filter(
    (item: SelectType) => item.num !== num,
  );
  currentIndex.value[num] = -1; // 恢复到-1即"全部"为高亮
};

const editorContent = ref("");

// 提交加载状态
const submitLoading = ref(false);

const exportToHtml = () => {
  // console.log(editorContent.value);
  const blob = new Blob([editorContent.value], { type: "text/html" });
  // 创建一个链接 之后让用户去点
  const documentLink = document.createElement("a");
  documentLink.href = URL.createObjectURL(blob); // URL是一个内置的对象 将blob的URL地址设置为a链接地址
  documentLink.download = "document.html"; //设置文件下载的文件名
  // 下面这个不用用户去点 主动触发
  documentLink.click();
  URL.revokeObjectURL(documentLink.href); // 把documentLink.href释放掉
};

const handleSubmit = async () => {
  // 1. 验证是否选择了分类
  if (selectList.value.length === 0) {
    ElMessage.warning("请至少选择一个分类标签");
    return;
  }

  // 2. 验证富文本内容是否为空
  if (!editorContent.value || editorContent.value.trim() === "") {
    ElMessage.warning("文章内容不能为空");
    return;
  }

  // 3. 二次确认
  try {
    await ElMessageBox.confirm("确认提交文章内容吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch {
    // 用户点击取消
    return;
  }

  // 4. 准备提交的数据
  const submitData = {
    // 已选分类的名称数组
    categories: selectList.value.map((item) => item.name),
    // 富文本内容
    content: editorContent.value,
    // 可以添加其他字段
    createTime: new Date().toISOString(),
  };

  console.log("提交的数据：", submitData);

  // 5. 调用接口提交
  submitLoading.value = true;
  try {
    const { data } = await submitArticleApi(submitData);
    console.log("提交成功：", data);

    ElMessage.success("文章提交成功！");

    // 6. 提交成功后清空表单
    editorContent.value = "";
    selectList.value = [];
    currentIndex.value = [-1, -1, -1];
  } catch (error) {
    console.error("提交失败：", error);
    ElMessage.error("文章提交失败，请重试");
  } finally {
    submitLoading.value = false;
  }
};
</script>

<style lang="less" scoped>
.title {
  display: inline-block;
  width: 80px;
  font-size: 14px;
}
.el-tag {
  cursor: pointer;
}
</style>
