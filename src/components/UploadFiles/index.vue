<template>
  <div class="container" :style="{'padding':!successFileList.length?'10px':'0'}">
    <div v-if="!successFileList.length" class="toolBox">
      <el-button class="custom_file">选择文件
        <input ref="fileInputRef" title=" " type="file" @change="fileInputFun">
      </el-button>
      <el-button class="startUpload" :disabled="uploadIng" @click="uploadFile">开始上传文件</el-button>
    </div>
    <div v-if="successFileList.length" class="successFileNameList">
      <div v-for="(item,index) in successFileList" :key="index" class="fileItem">
        <div class="">
          {{ item.file_name }}
        </div>
        <div class="iconBox">
          <!--          <i class="el-icon-remove del" @click="delDataFun(item,index)" />-->
          <!--          <i class="el-icon-view see" @click="seeDataFun(item,index)" />-->
          <!--          <i class="el-icon-download download " @click="downloadDataFun(item,index)" />-->
        </div>
      </div>
    </div>
    <div v-else class="fileNameList">
      <div v-for="(item,index) in fileList" :key="index" class="fileItem">
        <div> {{ item.name }}</div>
        <div> 文件大小：{{ item.fileSize }}</div>
      </div>
    </div>
    <div v-if="!successFileList.length" class="progressBox">
      <el-progress
        :percentage="percentage"
        :stroke-width="26"
        :text-inside="true"
        class="progress"
      />
    </div>
  </div>
</template>

<script>
import { mergeFragmentFileApi, uploadFileApi, uploadSliceFileApi } from '@/api/common.js'
import { successTips } from '@/utils';

export default {
  name: 'UploadFiles2',
  props: {
    // 单个文件最大大小（MB）
    maxSize: {
      type: Number,
      default: 5 // 100MB
    },
    // 文件格式
    format: {
      type: Array,
      default: () => {
        return ['mp4']
      }
    },
    // 文件格式
    seeFormat: {
      type: Array,
      default: () => {
        return ['mp4']
      }
    },
    // 文件列表
    defaultFileList: {
      type: Array,
      default: () => {
        return []
      }
    },

  },
  data() {
    return {
      // 进度条
      percentage: 0,
      // 已上传完成的分片索引
      index: -1,
      // 上传状态
      uploadIng: false,
      // 选择的文件
      fileList: [],
      // 文件类型
      fileType: '',
      // 上传成功的文件
      successFileList: [],
      fileId: '',

    };
  },
  computed: {},
  watch: {
    defaultFileList(value) {
      if (value.length) {
        this.successFileList = value
      }
    },
    immediate: true
  },
  methods: {
    // 上传文件
    fileInputFun() {
      const { files } = this.$refs['fileInputRef']
      const fileList = [files[0]]
      this.fileList = fileList.map(item => {
        item.fileExtension = item.name.match(/\.[^.]+$/)[0].slice(1);
        item.fileSize = (item.size / (1024 * 1024)).toFixed(2) + ' MB'
        return item
      })
    },
    // 开始上传
    uploadFile() {
      if (this.fileList.length) {
        const { files } = this.$refs['fileInputRef']
        const file = files[0]
        this.uploadIng = true
        if (file.fileExtension === 'zip') {
          this.uploadFileFromIndex(file, 0)
        } else if (file.fileExtension === 'mp4') {
          this.uploadFileFun(file)
        }
      } else {
        this.$message({
          message: '请选择文件后开始上传！',
          type: 'warning'
        });
      }
    },

    // 从第几个分片开始上传（index从0开始算，index=0算作第一个分片）
    uploadFileFromIndex(file, index) {
      const _this = this
      const chunkSize = _this.maxSize * 1024 * 1024 // 分片大小 5M
      const chunkTotalCount = Math.ceil(file.size / chunkSize) // 分片总数
      uploadSliceFile(index)

      // 上传指定索引的分片文件
      function uploadSliceFile(idx) {
        if (idx >= chunkTotalCount) {
          console.log('文件已上传完成...');
          return
        }

        // 分片开始位置
        const start = idx * chunkSize
        // 分片结束位置
        const end = (start + chunkSize) > file.size ? file.size : start + chunkSize
        // 对文件分片
        const sFile = new File([file.slice(start, end)], `${file.name}.${idx}`)
        const formData = new FormData()
        formData.append('file', sFile)
        formData.append('file_name', file.name)
        formData.append('file_id', _this.fileId)
        formData.append('index', idx)

        uploadSliceFileApi(formData).then(res => {
          if (res.msg === 'success') {
            if (!_this.fileId) {
              _this.fileId = res.data.file_id
            }
            if (idx === chunkTotalCount - 1) {
              // 已经上传完了最后一个分片
              // 记录已完成的分片索引
              _this.index = idx
              _this.percentage = 100
              // 发送合并文件请求
              const mergeParams = {
                file_id: _this.fileId,
                file_name: file.name,
                total: chunkTotalCount,
              }
              mergeFragmentFile(mergeParams)
            } else {
              // 上传完成指定索引的分片之后, 更新文件上传进度
              _this.percentage = parseFloat(((idx + 1) / chunkTotalCount * 100).toFixed(1))

              // 记录已完成的分片索引
              _this.index = idx

              if (!_this.isStop) {
                // 如果没有点击暂停的话, 再上传下一个索引的分片
                uploadSliceFile(++idx)
              }
            }
          }
        })
      }

      // 发送合并分片文件请求
      function mergeFragmentFile(params) {
        mergeFragmentFileApi(params).then(res => {
          successTips(_this, 'success', '上传成功！')
          _this.successFileList.push(res.data)
          _this.$emit('uploadSuccess', res.data)
        })
      }
    },
    // 上传视频
    uploadFileFun(file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadFileApi(formData).then(res => {
        if (res.msg === 'success') {
          this.successFileList.push(res.data)
          this.percentage = 100
          successTips(this, 'success', '上传成功！')
          this.$emit('uploadSuccess', res.data)
        }
      })
    },
    // 删除
    delDataFun(item, index) {
      this.successFileList = []
      this.fileList = []
      this.percentage = 0
      this.uploadIng = false
    },
    // 查看
    seeDataFun(item, index) {
      const fileExtension = item.file_name.match(/\.[^.]+$/)[0].slice(1);
      if (this.seeFormat.includes(fileExtension)) {
        console.log('查看')
      } else {
        this.$message({
          message: '不可查看' + fileExtension + '格式文件',
          type: 'error'
        });
      }
    },
    // 下载
    downloadDataFun(item, index) {
      const fileExtension = item.file_name.match(/\.[^.]+$/)[0].slice(1);
      let url = ''
      if (fileExtension === 'zip') {
        url = `${process.env.VUE_APP_BASE_PATH}:${process.env.VUE_APP_SERVER_PORT}` + item.url
      } else {
        url = item.url
      }

      const link = document.createElement('a');
      const body = document.querySelector('body');
      link.href = url;
      link.setAttribute('download',item.file_name)
      link.style.display = 'none';
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    },
    // 清空数据
    resetFileFun() {
      this.percentage = 0
      this.index = -1
      this.uploadIng = false
      this.fileList = []
      this.successFileList = []
      this.fileId = ''
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  color: #000;
  padding: 10px;
  border-radius: 10px;
  background: rgba(0, 168, 255, 0.1);
  overflow: hidden;

  .toolBox {
    display: flex;
    justify-content: space-between;
    font-size: 20px;

    .startUpload {
      height: 32px;
      display: flex;
      line-height: 1;
      text-align: center;
      flex-shrink: 0;
      font-size: 12px;
      overflow: hidden;
      position: relative;
      background: rgb(103, 194, 58);
      border: 1px solid rgb(103, 194, 58);
      border-radius: 4px;
      color: #FFF;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      text-indent: 0;
    }

  }

  .fileNameList {
    .fileItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      font-size: 12px;
      width: 100%;
      padding: 0 10px;
      border-radius: 8px;
      background: rgba(108, 117, 125, 0.1);
    }

  }

  .successFileNameList {
    .fileItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      font-size: 12px;
      width: 100%;
      padding: 0 10px;
      border-radius: 8px;
      background: rgba(108, 117, 125, 0.1);

      .iconBox {
        i {
          font-size: 16px;
          cursor: pointer;
          margin-right: 10px;
        }

        .del {
          color: red;
        }

        .see {
          color: #67c23a;
        }

        .download {
          color: rgb(64, 158, 255);
        }
      }
    }

  }

  .progressBox {
    margin-top: 10px;

    .progress {
      width: 100%;
      border-radius: 13px;
      height: 20px;
    }
  }

}
</style>
