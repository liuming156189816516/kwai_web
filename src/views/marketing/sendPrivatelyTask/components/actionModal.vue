<!-- 新增/编辑/查看 -->
<template>
  <div class="actionPage">
    <el-dialog
      :close-on-click-modal="false"
      :title="modal.type==='add'?'新建':modal.type==='edit'?'编辑':'查看'"
      :visible.sync="modal.show"
      center
      width="50%"
      @close="closeModal"
    >
      <div :style="{'max-height':modalHeight+300+'px'}" class="content">
        <el-form
          ref="formData"
          :model="formData"
          :rules="formRules"
          class="demo-ruleForm"
          label-width="20%"
          size="small"
        >
          <h3 class="contTitle">基础信息</h3>
          <el-divider />
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item label="任务名称：" prop="task_name">
                <el-input v-model="formData.name" maxlength="20" show-word-limit @input="changeInput" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item class="custom_mess" label="选择账号：" prop="group_id">
                <div class="mess_01">
                  <div class="mess_t_01">
                    <span class="mess_t_02" style="cursor: pointer;" @click="resetGroupIdFun">重置</span>
                  </div>
                  <el-form-item label="选择分组：" label-width="100px" prop="group_id" style="margin-right: 20px;">
                    <el-select
                      v-model="formData.group_id"
                      :placeholder="$t('sys_c052')"
                      collapse-tags
                      multiple
                      style="margin-left: 20px;"
                      @change="changeAccountNum"
                    >
                      <el-option
                        v-for="item in accountGroupList"
                        :key="item.id"
                        :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"
                        :value="item.group_id"
                      />
                    </el-select>
                  </el-form-item>
                  <div class="mess_t_01">
                    预计群发账号数: <span class="mess_t_02">{{ totalNum }}</span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item label="选择数据：" prop="ws_data">
                <el-radio-group v-model="formData.ws_data">
                  <el-radio :label="1">粉丝数据</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item prop="data_pack_id">
                <el-select v-model="formData.data_pack_id" :placeholder="$t('sys_c052')">
                  <el-option
                    v-for="item in datapackList"
                    :key="item.id"
                    :label="item.name+'(入库数量：'+item.into_num+'，剩余数量：'+item.residue_num+')'"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <h3 class="contTitle">规则设置</h3>
          <el-divider />
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item label="群发模式：" prop="send_type">
                <el-radio-group v-model="formData.send_type">
                  <el-radio :label="1">普通文本</el-radio>
                  <el-radio :label="2">超链文本</el-radio>
                  <el-radio :label="3">混合发送</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item>
                <div class="number_01">
                  <span class="number_02">账号每私发条数</span>
                  <span class="number_03">
                    <el-input-number
                      v-model="formData.send_num"
                      :min="1"
                      label="描述文字"
                      style="width: 120px;"
                      type="number"
                    />
                  </span>
                  <span class="number_02">条数据则完成账号群发任务。</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item>
                <div class="number_01">
                  <span class="number_02">每个账号群发间隔为：</span>
                  <span class="number_03">
                    <el-input-number
                      v-model="formData.min_time"
                      :min="1"
                      label="描述文字"
                      style="width: 120px;"
                      type="number"
                    />
                  </span>
                  <span class="number_02">~</span>
                  <span class="number_03">
                    <el-input-number
                      v-model="formData.max_time"
                      :min="1"
                      label="描述文字"
                      style="width: 120px;"
                      type="number"
                    />
                  </span>
                  <span class="number_02">秒。</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <h3 class="contTitle">话术设置</h3>
          <el-divider />
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item class="custom_say" label="群发话术：" prop="material_list">
                <div class="mess_01">
                  <el-button
                    v-for="(item,idx) in btnOption"
                    :key="idx"
                    size="mini"
                    type="primary"
                    @click="openRhetoricModal(null,idx)"
                  >{{ item }}
                  </el-button>
                  <el-table
                    row-key="id"
                    show-body-overflow="title"
                    element-loading-spinner="el-icon-loading"
                    :cell-style="{ textAlign: 'center' }"
                    :data="formData.material_list"
                    :header-cell-style="{ color: '#909399', textAlign: 'center' }"
                    style="width: 100%"
                  >
                    <el-table-column label="序号" type="index" width="60" />
                    <el-table-column label="内容" min-width="100" prop="content">
                      <template slot-scope="scope">
                        {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="action" width="120">
                      <template slot-scope="scope">
                        <el-button class="custom_btn" size="mini" @click="editContentFun(scope.row,scope.index)">
                          <i class="el-icon-edit" />
                        </el-button>
                        <el-button class="custom_btn" size="mini" @click="delContentFun(scope)">
                          <i class="el-icon-delete-solid" />
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button :loading="isLoading" type="primary" @click="submitForm('formData')">开始群发</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog>

    <!-- 群发话术/新建/编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="rhetoricModal.type==='add'?'新建':rhetoricModal.type==='edit'?'编辑':'查看'"
      :visible.sync="rhetoricModal.show"
      center
      width="30%"
      @close="closeRhetoricModal"
    >
      <div class="content">
        <div style="font-size: 16px;margin: 10px 0">内容：</div>
        <div>
          <el-input
            v-model="rhetoricModal.formData.content"
            :rows="2"
            placeholder="请输入内容"
            type="textarea"
            @input="changeInput"
          />
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeRhetoricModal">取 消</el-button>
        <el-button type="primary" @click="submitRhetoricModal">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils';

export default {
  name: 'ActionModal',
  props: {
    modalHeight: {
      type: Number,
      default: 400
    },
  },
  data() {
    return {
      modal: {
        show: false,
        type: '',
      },
      formData: {
        name: '',
        group_id: '',
        data_pack_id: 1,
        send_type: '',
        send_num: 115,
        min_time: 10,
        max_time: 15,
        material_list: [],
        ws_data: 1
      },
      totalNum: 0,
      formRules: {
        task_name: [{ required: true, message: '请选择', trigger: 'blur' }],
        source_num: [{ required: true, message: '请选择', trigger: 'change' }],
        group_id: [{ type: 'array', required: true, message: '请选择', trigger: 'change' }],
        ws_data: [{ required: true, message: '请选择', trigger: 'change' }],
        end_time: [{ required: true, message: '请选择', trigger: 'change' }],
        group_type: [{ required: true, message: '请选择', trigger: 'change' }],
        group_say: [{ required: true, message: '请选择', trigger: 'change' }],
        data_pack_id: [{ required: true, message: '请选择', trigger: 'change' }],
        material_list: [{ required: true, message: '请添加话术', trigger: 'change' }]
      },
      btnOption: ['添加素材'],
      accountGroupList: [], // 账号分组
      datapackList: [], // 数据包
      rhetoricModal: {
        show: false,
        type: '',
        formData: {
          content: ''
        }
      }
    }
  },
  methods: {
    open(form, type) {
      this.modal.type = type
      this.modal.show = true
      if (form) {
        console.log('form', form)
      }
    },
    // 重置
    resetGroupIdFun() {},
    // 选择账号分组
    changeAccountNum() {},
    // 关闭弹窗
    closeModal() {
      this.modal.show = true
      this.modal.loading = false
      this.modal.type = ''
    },
    // 打开 话术弹窗
    openRhetoricModal(form, index) {
      this.rhetoricModal.type = !index ? 'add' : ''
      this.rhetoricModal.show = true
    },
    // 编辑 话术弹窗
    editContentFun(row,index) {
      // this.rhetoricModal.show = true
      // this.rhetoricModal.type = 'edit'
      // this.rhetoricModal.formData = deepClone(row)
      console.log('row',row)
      console.log('index',index)
    },
    // 删除 话术
    delContentFun(form) {
      this.formData.material_list.splice(form._index,1)
    },
    // 提交
    submitRhetoricModal() {
      if (!this.rhetoricModal.formData.content) {
        this.$message.warning('请输入内容')
        return false
      }
        console.log('this.rhetoricModal.formData',this.rhetoricModal.formData)
        const type = this.rhetoricModal.type
        const formData = deepClone(this.rhetoricModal.formData)
        if (type === 'add') {
          this.formData.material_list.push(formData)
        } else if (type === 'edit') {
          this.formData.material_list[formData._index] = formData
        }
      console.log('this.formData.material_list',this.formData.material_list)
     // setTimeout(() => {
     //   this.closeRhetoricModal()
     // },200)
    },
    // 关闭 话术弹窗
    closeRhetoricModal() {
      this.rhetoricModal.show = false
      this.rhetoricModal.type = ''
      this.rhetoricModal.formData.content = ''
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modal.loading = false
          console.log('111提交')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}

.content {
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-sizing: border-box;

  .contTitle {
    font-weight: 400;
    color: #1f2f3d;
    font-size: 22px;
    margin: 10px 0 0 0;

  }

  .content_01 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .audio_src {
    width: 140px;
    height: 30px;
  }

  .content_02 {
    width: 44px;
    height: 28px;
  }

  .custom_btn {
    padding: 0;
    color: #409eff;
    background: transparent;
    border-color: transparent;

    i {
      font-size: 16px;
    }
  }

  ::v-deep .el-alert {
    background: #ecf5ff;

    .el-alert__title {
      color: #409eff;
      font-size: 16px;
    }
  }

  ::v-deep .el-alert__description {
    font-size: 14px;
    line-height: 24px;
  }

  .custom_mess, .custom_say {
    .mess_01 {
      width: 100%;
      padding: 10px 16px 10px 16px;
      background-color: #ecf5ff;
      border-radius: 4px;
      position: relative;
      box-sizing: border-box;

      .mess_t_01 {
        font-size: 12px;
        display: flex;
        justify-content: flex-end;

        .mess_t_02 {
          color: #409eff;
          font-weight: bold;
        }
      }
    }
  }

  .custom_say {
    .mess_01 {
      border-radius: 4px;
      background: transparent;
      border: 1px solid #dcdfe6;
    }
  }

  .number_01 {
    display: flex;
    font-size: 12px;
    line-height: 16px;

    .number_02 {
      display: flex;
      align-items: center;
    }

    .number_03 {
      margin: 0 5px;
    }
  }
}

</style>
