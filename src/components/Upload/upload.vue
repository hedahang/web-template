<template>
  <div></div>
</template>

<script>
import { config, util } from "@/utils/common";
import { getToken } from "@/utils/auth";

export default {
  props: {
    fileName: {
      type: String,
      default: ""
    },
    value: String,
    maxSize: {
      type: Number,
      default: 3
    },
    limit: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      defult() {
        return undefined;
      }
    }
  },
  data() {
    return {
      action: config.uploadAction,
      fileList: [],
      headers: { Authorization: getToken() }
    };
  },
  computed: {
    validTip() {
      return this.validType ? `只能上传${this.validType.join("/")}文件` : "";
    },
    sizeTip() {
      return this.maxSize ? `文件大小不超过${this.maxSize}M` : "";
    },
    tip() {
      let result = "";
      result += this.validTip;
      if (this.sizeTip) {
        if (result) {
          result += "，";
        }
        result += this.sizeTip;
      }
      return result;
    },
    val() {
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
    value: {
      immediate: true,
      handler() {
        if (this.value !== this.val) {
          let fileList = [];
          if (this.value) {
            const fileNameArr =
              typeof this.fileName === "string" ? this.fileName.split(",") : [];
            fileList = this.value.split(",").map((url, index) => {
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
    val() {
      this.$emit("input", this.val);
      const newFileName = this.fileList
        .map(file => {
          if (file.response) {
            return file.response.data.name;
          }
          return file.name;
        })
        .join(",");
      this.$emit("update:fileName", newFileName);
    }
  },
  methods: {
    getUrl(value) {
      return util.getFileUrl(value);
    },
    handleUploadSuccess(res, file, fileList) {
      console.log(file);
      if (file.response.code !== 200) {
        this.$message.error(file.response.msg || "上传失败");
        fileList.some((f, index) => {
          if (file === f) {
            fileList.splice(index, 1);
            return true;
          }
        });
      } else {
        if (!file.url) {
          file.url = file.response.data.url;
        }
        file.name = file.response.data.name;
      }
      //TODO: 由于fileList内部属性更改不会触发计算val属性，故给fileList重新赋值使得val重新计算，是否可优化？
      this.fileList = [...fileList];
    },
    handleUploadError(err, file, fileList) {
      // TODO:
    },
    checkValid(file) {
      if (file.raw) file = file.raw;
      const fileName = file.name;
      const fileNameArr = file.name.split(".");
      const maxSize = this.maxSize;
      const isValidType =
        !this.validType ||
        this.validType.some(
          item =>
            file.type.includes(item) ||
            fileNameArr[fileNameArr.length - 1] === item
        );
      const isValidSize = !maxSize || file.size / 1024 / 1024 <= maxSize;

      if (!isValidType) {
        this.$message.error(this.validTip);
        return false;
      } else if (!isValidSize) {
        this.$message.error(this.sizeTip);
        return false;
      }
      return true;
    },
    handleRemove(file, fileList) {
      //TODO: 由于fileList内部属性更改不会触发计算val属性，故给fileList重新赋值使得val重新计算，是否可优化？
      this.fileList = [...fileList];
    },
    handleExceed() {
      this.$message.warning("上传文件超过最大数量限制");
    },
    handlePreview(file) {
      window.open(this.getUrl(file.url));
    }
  }
};
</script>
