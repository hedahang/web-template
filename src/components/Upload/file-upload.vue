<template>
  <div class="upload-container">
    <el-upload
      ref="uploadFile"
      class="upload-demo uplpad-other-file"
      accept="doc"
      :headers="headers"
      :action="uploadFileUrl"
      :limit="limit"
      :on-remove="handleFileRemove"
      :on-success="handleFileSuccess"
      :on-preview="handleDownFile"
      :before-upload="beforeUpload"
      :on-exceed="handleExceedLimit"
      :with-credentials="true"
      :file-list="fileList"
      :multiple="multiple"
    >
      <div class="upload-content">
        <el-button size="small" type="text">点击上传</el-button>
        <div class="el-upload__tip">
          支持的文件格式为jpg、jpeg、png、docx、pdf、doc，每个文件大小不超过{{ maxSize }}M
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { msg, util } from "@/utils/common";
import { getToken } from "@/utils/auth";
import { config } from "@/utils/common";

export default {
  name: "fileUpload",
  props: {
    initFileData: Array,
    fileName: String,
    filePath: String,
    maxSize: {
      type: Number,
      default: 10
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      uploadFileUrl: config.uploadAction,
      headers: { Authorization: getToken() },
      fileList: []
    };
  },
  computed: {
    fileNameVal() {
      return this.fileList
        .map(file => {
          if (file.response) {
            return file.response.data.name;
          }
          return file.name;
        })
        .join(",");
    },
    filePathVal() {
      return this.fileList
        .map(file => {
          if (file.response) {
            return file.response.data.url;
          }
          return file.url;
        })
        .join(",");
    },
    multiple() {
      return this.limit > 1;
    }
  },
  watch: {
    filePath: {
      immediate: true,
      handler() {
        if (this.filePath !== this.filePathVal) {
          let fileList = [];
          if (this.filePath) {
            const fileNameArr =
              typeof this.fileName === "string" ? this.fileName.split(",") : [];
            fileList = this.filePath.split(",").map((url, index) => {
              const urlArr = url.split("/");
              return {
                url,
                name: fileNameArr[index] || urlArr[urlArr.length - 1]
              };
            });
          }
          this.fileList = fileList;
        }
      }
    },
    filePathVal() {
      this.$emit("update:filePath", this.filePathVal);
      this.$emit("update:fileName", this.fileNameVal);
    }
  },
  created() {},
  methods: {
    // 上传文件超过最大数量限制
    handleExceedLimit() {
      msg.error(`上传文件超过最大数量(${this.maxSize})限制`);
    },
    // 上传文件操作filePath
    handleFileSuccess(response, file, fileList) {
      let rs = file.response;
      console.log(rs);
      if (rs.code == 200) {
        if (!file.url) {
          file.url = file.response.data.url;
        }
        file.name = file.response.data.name;
      } else {
        this.$message.error(file.response.resultMsg || "上传失败");
        fileList.some((f, index) => {
          if (file === f) {
            fileList.splice(index, 1);
            return true;
          }
        });
      }
      //TODO: 由于fileList内部属性更改不会触发计算val属性，故给fileList重新赋值使得val重新计算，是否可优化？
      this.fileList = [...fileList];
    },
    handleFileRemove(file, fileList) {
      this.fileList = [...fileList];
    },
    beforeUpload(file) {
      const isSupport = util.isSupportFileType(file.name, [
        "DOC",
        "DOCX",
        "PDF",
				"JPG",
				"JPEG",
				"PNG"
      ]);
      const maxSize = this.maxSize;
      const isValidSize = !maxSize || file.size / 1024 / 1024 < maxSize;
      if (!isSupport) {
        msg.error("不支持该文件类型!");
      }
      if (!isValidSize) {
        msg.error(`文件大小不能超过 ${maxSize}MB!`);
      }
      return isSupport && isValidSize;
    },
    handleDownFile(file) {
      let url = file.url;
      if (!url) {
        url = `${file.response.data.filePath}`;
      }
      window.open(`${url}`);
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.upload-container {
  width: 100%;
  position: relative;
  .upload-content {
    text-align: left;
    .el-button {
      color: #1bff16;
      text-decoration: underline;
    }
  }
  .el-upload__tip {
    margin-top: 0;
    line-height: 0.2rem;
    color: #a2a2a2;
  }
}
</style>
