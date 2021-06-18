<template>
  <div class="app-container">
    <!-- 筛选框 -->
    <el-row class="header-container">
      <el-col :span="18">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
        >
          <el-form-item prop="titie">
            <el-input
              v-model="queryParams.titie"
              placeholder="请输入标题"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dateRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="6" style="text-align:right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['system:banner:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <div class="table-container">
      <el-table v-loading="loading" :data="bannerList"
        ><el-table-column type="index" label="序号" align="center" width="100">
        </el-table-column>
        <el-table-column
          label="标题"
          prop="title"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="图片" width="200" align="center"
          ><template slot-scope="scope">
            <img
              style="height:80px"
              :src="scope.row.imgUrl"
              alt=""
            /> </template
        ></el-table-column>
        <el-table-column
          label="内容"
          align="center"
          prop="content"
          show-overflow-tooltip
        />
        <el-table-column
          label="更新时间"
          align="center"
          prop="modifyTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.modifyTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:banner:edit']"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:banner:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或编辑轮播图配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        size="small"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片上传" prop="imgUrl">
          <ImgUpload v-model="form.imgUrl"></ImgUpload>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button size="small" @click="bindResetForm">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImgUpload from "@/components/Upload/img-upload";
import {
  listBanner,
  getBanner,
  delBanner,
  addBanner,
  updateBanner
} from "@/api/system/banner";

export default {
  name: "Banner",
  components: { ImgUpload },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 轮播图表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined
      },
      // 表单参数
      form: {},
      oldForm: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        imgUrl: [{ required: true, message: "图片不能为空", trigger: "blur" }],
        content: [{ required: true, message: "内容不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    $route: {
      handler() {
        // 跳转是关闭弹框
        this.open = false;
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询轮播图列表 */
    getList() {
      this.loading = true;
      // 如果删除输入框的数据，queryParams.title或被赋值为“”，传到后台就查询不到数据
      this.queryParams.title = this.queryParams.title
        ? this.queryParams.title
        : null;
      listBanner(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.bannerList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 重置表单按钮
    bindResetForm() {
      this.form = JSON.parse(this.oldForm);
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        title: undefined,
        imgUrl: undefined,
        content: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.oldForm = JSON.stringify(this.form);
      this.open = true;
      this.title = "添加轮播图";
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getBanner(id).then(response => {
        this.form = response.data;
        this.oldForm = JSON.stringify(this.form);
        this.open = true;
        this.title = "编辑轮播图";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // type设置为1，默认是app轮播
          let temp = {
            ...this.form,
            type: 1
          };
          if (temp.id !== undefined) {
            updateBanner(temp).then(() => {
              this.msgSuccess("编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBanner(temp).then(() => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const bannerIds = row.id;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delBanner(bannerIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
