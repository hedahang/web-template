/* eslint-disable */

module.exports = {
  'POST /api/file/ossupload': (req, res) => {
    res.json({
      code: 200,
      // resultCode: Math.round(Math.random()),
      resultMsg: "上传成功",
      data: {
        filePath: "/test.png",
        fileName: "test.txt"
      }
    });
  }
};