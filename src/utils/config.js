let webSocketUrl;
let baseURL = process.env.VUE_APP_BASE_API;
const config = {
  baseURL,
  webSocketUrl,
  // 上传路径
  uploadAction: baseURL + "/file/ossupload"
};

export default config;
