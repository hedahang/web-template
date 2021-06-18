<template>
  <div>
    <el-upload
      ref="uploadDoc"
      class="img-uploader"
      :class="{ disabled: limit <= fileList.length }"
      :file-list="fileList"
      :action="action"
      :on-success="handleUploadSuccess"
      :on-exceed="handleExceed"
      :on-error="handleUploadError"
      :before-upload="checkValid"
      auto-upload
      list-type="picture-card"
      :multiple="multiple"
      :limit="limit"
      :headers="headers"
      :data="data"
    >
      <i class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img
          class="el-upload-list__item-thumbnail"
          :src="getUrl(file.url)"
          alt=""
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <div slot="tip" class="el-upload__tip">
        {{ tip }}
      </div>
    </el-upload>
  </div>
</template>

<script>
import Upload from "./upload";

export default {
  extends: Upload,
  data() {
    return {};
  },
  props: {
    validType: {
      type: Array,
      default() {
        return ["jpeg", "png"];
      }
    }
  },
  methods: {
    handleRemove(file) {
      this.fileList.some((f, index) => {
        if (file === f) {
          this.fileList.splice(index, 1);
          return true;
        }
      });
    },
    clearList() {
      this.$refs.uploadDoc.clearFiles();
    }
  }
};
</script>

<style lang="less" scoped>
@size: 148px;

/deep/ .img-uploader {
  &.disabled {
    .el-upload--picture-card {
      display: none;
    }
  }
  .el-upload--picture-card,
  .el-upload-list--picture-card,
  .el-upload-list__item {
    width: @size;
    height: @size;
  }
  .el-upload--picture-card {
    line-height: @size;
  }
}
</style>
