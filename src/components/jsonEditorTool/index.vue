<template>
  <div class="json-page">
    <div class="card">
      <div class="card-header">
        <div class="btn-group">
          <el-button type="primary" @click="beautify">格式化</el-button>
          <el-button type="primary" @click="minify">压缩</el-button>
          <el-button type="primary" @click="validateJson">验证</el-button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="warningMsg" :class="warningClass" class="alert">
          {{ warningMsg }}
        </div>
        <div class="content_box">
          <div class="left_box">
            <div ref="jsonEditor1" class="editor" />
          </div>
          <div class="icon_box">
            <el-button class="icon_btn" icon="el-icon-right" type="primary" @click="toTree" />
            <el-button class="icon_btn" icon="el-icon-back" type="primary" @click="toCode" />
          </div>
          <div class="right_box">
            <div ref="jsonEditor2" class="editor" />
          </div>
        </div>
      </div>

      <div v-if="showFooter" class="card-footer">
        <el-button type="primary" @click="submitJsonFun">{{ subTitle }}</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

export default {
  name: 'JsonTool',
  model: {
    prop: 'jsonData',
    event: 'input'
  },
  props: {
    jsonData: {
      type: [Object, String],
      default: () => null
    },
    subTitle: {
      type: String,
      default: '确认'
    },
    showFooter: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {
      editor1: null,
      editor2: null,
      warningMsg: '',
      warningClass: 'alert-warning',
      defaultJson: {
        sites: {
          site: [
            { id: '1', name: '示例数据1', },
            { id: '3', name: '示例数据1', }
          ]
        }
      }
    };
  },
  watch: {
    jsonData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.UpdateDataFun(newVal)
        }
      },
      deep: true
    }

  },
  mounted() {
    let json = {
      sites: {
        site: [
          { id: '1', name: '示例数据1', },
          { id: '3', name: '示例数据1', }
        ]
      }
    };
    if (this.jsonData) {
      json = this.jsonData
    }
    this.editor1 = new JSONEditor(this.$refs.jsonEditor1, { mode: 'code' }, json);
    this.editor2 = new JSONEditor(this.$refs.jsonEditor2, { mode: 'tree' }, json);
    this.editor2.expandAll();
  },
  methods: {
    // 指向向树形预览窗口
    toTree() {
      try {
        const jsonStr = this.editor1.getText();
        this.editor2.setText(jsonStr);
        this.editor2.setMode('tree');
        this.editor2.expandAll();
      } catch (e) {
        this.showError(e);
      }
    },
    // 指向向字符串窗口
    toCode() {
      try {
        const jsonStr = this.editor2.getText();
        const obj = JSON.parse(jsonStr);
        this.editor1.setText(JSON.stringify(obj, null, 2));
        this.editor1.setMode('code');
      } catch (e) {
        this.showError(e);
      }
    },
    // 格式化
    beautify() {
      try {
        const obj = JSON.parse(this.editor1.getText());
        this.editor1.setText(JSON.stringify(obj, null, 2));
        this.editor2.setText(JSON.stringify(obj, null, 0));
        this.editor2.setMode('tree');
        this.editor2.expandAll();
      } catch (e) {
        this.showError(e);
      }
    },
    // 压缩
    minify() {
      try {
        const obj = JSON.parse(this.editor1.getText());
        this.editor1.setText(JSON.stringify(obj));
        this.editor2.setText(JSON.stringify(obj));
        this.editor2.setMode('tree');
        this.editor2.expandAll();
      } catch (e) {
        this.showError(e);
      }
    },
    // 校验json合法性
    validateJson() {
      try {
        JSON.parse(this.editor1.getText());
        this.showSuccess('JSON 数据合法');
      } catch (e) {
        this.showError(e);
      }
    },
    // 校验失败
    showError(e) {
      this.warningMsg = 'JSON 数据错误: ' + e.message;
      this.warningClass = 'alert-danger';
      setTimeout(() => (this.warningMsg = ''), 3000);
    },
    // 校验成功
    showSuccess(msg) {
      this.warningMsg = msg;
      this.warningClass = 'alert-success';
      setTimeout(() => (this.warningMsg = ''), 3000);
    },
    // 确认
    submitJsonFun() {
      this.$emit('callbackJson', this.editor1.getText())
    },
    // 更新数据
    UpdateDataFun(val) {
      console.log('  this.editor1', this.editor1)
      this.editor1.set(val);
      this.editor2.set(val);
    },
    // 关闭
    closeClearFun() {
      this.jsonContent = null
      this.jsonData = null
    }
  }
};
</script>

<style lang="scss" scoped>
.json-page{
  overflow: hidden;
}
.card-header {
  margin-bottom: 12px;
}

.content_box {
  display: flex;

  .left_box {
    width: 48%;
  }

  .icon_box {
    width: 6%;
    text-align: center;

    .icon_btn {
      margin: 0 0 15px;
      font-size: 24px;
      padding: 8px 12px;
    }
  }

  .right_box {
    width: 48%;
  }

}

.editor {
  height: 63vh;
  min-height: 450px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
