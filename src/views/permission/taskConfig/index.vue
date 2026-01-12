<!-- 任务配置 -->
<template>
  <div class="taskConfig" style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.id" clearable placeholder="请输入主键ID" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getTaskConfigFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun('add')">新建</el-button>
      </el-form-item>
      <el-form-item v-if="false">
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, idx) in setBatchData.batchOption"
              v-show="item.label"
              :key="idx"
              :command="{item,idx}"
            >
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="tableContent">
      <u-table
        ref="serveTable"
        v-loading="loading"
        :data="tableData"
        :height="cliHeight"
        border
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @selection-change="handleSelectionChange"
      >

        <u-table-column type="selection" width="55" />
        <u-table-column label="序号" type="index" width="60" />
        <u-table-column label="方案名称" min-width="120" prop="plan_name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </u-table-column>
        <u-table-column label="年龄" min-width="120" prop="age" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row[scope.column.property] ? getLabelArrByVal(scope.row[scope.column.property], addModal.ageList) : '-'
            }}
          </template>
        </u-table-column>
        <u-table-column label="性别" min-width="120" prop="gender" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row[scope.column.property] ? getLabelByVal(scope.row[scope.column.property], addModal.genderList) : '-'
            }}
          </template>
        </u-table-column>
        <u-table-column label="流量类型" min-width="120" prop="traffic_type" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row[scope.column.property] ? getLabelByVal(scope.row[scope.column.property], addModal.trafficTypeList) : '-'
            }}
          </template>
        </u-table-column>
<!--        <u-table-column label="投放模式" min-width="120" prop="mod" show-overflow-tooltip>-->
<!--          <template slot-scope="scope">-->
<!--            {{-->
<!--              scope.row[scope.column.property] ? getLabelByVal(scope.row[scope.column.property], addModal.modList) : '-'-->
<!--            }}-->
<!--          </template>-->
<!--        </u-table-column>-->
        <u-table-column label="生成短链" min-width="120" prop="is_short_url" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row[scope.column.property] ? getLabelByVal(scope.row[scope.column.property], addModal.isShortUrlList) : '-'
            }}
          </template>
        </u-table-column>
<!--        <u-table-column label="协议类型" min-width="120" prop="execute_mode" show-overflow-tooltip>-->
<!--          <template slot-scope="scope">-->
<!--            {{-->
<!--              scope.row[scope.column.property] ? getLabelByVal(scope.row[scope.column.property], addModal.executeModeList) : '-'-->
<!--            }}-->
<!--          </template>-->
<!--        </u-table-column>-->
        <u-table-column label="按钮类型" min-width="120" prop="button_code" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row[scope.column.property] ? getLabelByVal(scope.row[scope.column.property], addModal.buttonCodeList) : '-'
            }}
          </template>
        </u-table-column>
        <u-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </u-table-column>
        <u-table-column fixed="right" label="操作" prop="operation" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <el-button size="small" style="margin-right: 15px" type="primary" @click="editOpenFun(scope.row)">编辑
            </el-button>

            <el-button size="small" @click="delDataFun(scope.row)">删除</el-button>
          </template>
        </u-table-column>

      </u-table>

      <div class="layui_page">
        <el-pagination
          :current-page.sync="queryData.page"
          :page-size="queryData.limit"
          :page-sizes="pageOption"
          :total="queryData.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize($event,'table')"
          @current-change="changePageCurrent($event,'table')"
        />
      </div>

    </div>

    <!-- 添加 编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.title"
      :visible.sync="addModal.show"
      center
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="方案名称" prop="plan_name">
          <el-input v-model="addModal.formData.plan_name" placeholder="请输入方案名称" />
        </el-form-item>
        <el-form-item label="年龄:" prop="age">
          <el-select v-model="addModal.formData.age" clearable filterable multiple placeholder="请选择年龄">
            <el-option v-for="item in addModal.ageList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-select v-model="addModal.formData.gender" clearable filterable placeholder="请选择性别">
            <el-option v-for="item in addModal.genderList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="流量类型:" prop="traffic_type">
          <el-select v-model="addModal.formData.traffic_type" clearable filterable placeholder="请选择浏览类型">
            <el-option
              v-for="item in addModal.trafficTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="投放模式:" prop="mod">-->
<!--          <el-select v-model="addModal.formData.mod" clearable filterable placeholder="请选择投放模式">-->
<!--            <el-option v-for="item in addModal.modList" :key="item.value" :label="item.label" :value="item.value" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="生成短链:" prop="is_short_url">
          <el-select v-model="addModal.formData.is_short_url" clearable filterable placeholder="请选择生成短链">
            <el-option
              v-for="item in addModal.isShortUrlList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="协议类型:" prop="execute_mode">-->
<!--          <el-select v-model="addModal.formData.execute_mode" clearable filterable placeholder="请选择协议类型">-->
<!--            <el-option-->
<!--              v-for="item in addModal.executeModeList"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="按钮类型:" prop="button_code">
          <el-select v-model="addModal.formData.button_code" clearable filterable placeholder="请选择按钮类型">
            <el-option
              v-for="item in addModal.buttonCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="editTaskConfigFun">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getTaskConfigListApi, addAndEditTaskConfigApi } from './api'
import { deepClone, resetPage, getLabelArrByVal, successTips, getLabelByVal, } from '@/utils';
import { formatTimestamp, } from '@/filters'

export default {
  name: 'TaskConfig',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 100,
        total: 0,
        id: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: 0,
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      addModal: {
        show: false,
        title: '',
        type: 'add',
        formData: {
          plan_name: '',
          age: [],
          gender: '1',
          traffic_type: '',
          mod:'',
          is_short_url:'',
          execute_mode:'',
          button_code:'',
        },
        cloneRow: {},
        rules: {
          plan_name: [{ required: true, message: '请输入方案名称！', trigger: 'change' }],
          age: [{ type: 'array', required: true, message: '请至少选择一个年龄段', trigger: 'change' }],
          gender: [{ required: true, message: '请选择性别！', trigger: 'change' }],
          traffic_type: [{ required: true, message: '请选择流量类型！', trigger: 'change' }],
          mod: [{ required: true, message: '请选择投放模式！', trigger: 'change' }],
          is_short_url: [{ required: true, message: '请选择生成短链！', trigger: 'change' }],
          execute_mode: [{ required: true, message: '请选择协议类型！', trigger: 'change' }],
          button_code: [{ required: true, message: '请选择按钮类型！', trigger: 'change' }],
        },
        isLoading: false,
        ageList: [
          { value: '1', label: '13-17' },
          { value: '2', label: '18-24' },
          { value: '3', label: '25-34' },
          { value: '4', label: '35-44' },
          { value: '5', label: '45-54' },
          { value: '6', label: '55+' },
        ],
        genderList: [
          { value: '1', label: '全部' },
          { value: '2', label: '男' },
          { value: '3', label: '女' },
        ],
        trafficTypeList: [
          { value: '1', label: '便宜' },
          { value: '2', label: '贵' },
        ],
        modList: [
          { value: '0', label: '模式1' },
          { value: '1', label: '模式2' },
        ],
        isShortUrlList: [
          { value: '0', label: '是' },
          { value: '1', label: '否' },
        ],
        executeModeList: [
          { value: '0', label: '真机' },
          { value: '1', label: '协议' },
        ],
        buttonCodeList: [
          { value: '0', label: 'Learn more' },
          { value: '1', label: 'Shop now' },
          { value: '2', label: 'Sign up' },
          { value: '3', label: 'Contact us' },
          { value: '4', label: 'Apply now' },
          { value: '5', label: 'Book now' },
          { value: '6', label: 'Donate now' },
          { value: '7', label: 'Download' },
          { value: '8', label: 'Request time' },
          { value: '9', label: 'See menu' },
          { value: '10', label: 'Watch more' },
          { value: '11', label: 'Call now' },
        ],
      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        batchOption: [
          { icon: 'delete', label: '批量删除' },
        ],
      },

    }
  },
  mounted() {
    this.getTaskConfigFun(1)
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 列表
    getTaskConfigFun(num) {
      this.loading = true;
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        id: this.queryData.id,
      }
      getTaskConfigListApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.gender = item.gender ? String(item.gender) : ''
            item.traffic_type = item.traffic_type ? String(item.traffic_type) : ''
            item.mod = item.mod ? String(item.mod) : '0'
            item.is_short_url = item.is_short_url ? String(item.is_short_url) : '0'
            item.execute_mode = item.execute_mode ? String(item.execute_mode) : '0'
            item.button_code = item.button_code ? String(item.button_code) : '0'
            return item
          });
          this.selectData = []
          this.selectIdData = []
        }
      })
    },
    // 重置
    restQueryBtn() {
      this.getTaskConfigFun(1)
      this.$refs.serveTable.clearSort()
    },
    // 新建
    addOpenFun(type) {
      this.addModal.title = '新建'
      this.addModal.type = type
      this.addModal.show = true
    },
    // 编辑
    editOpenFun(form) {
      this.addModal.title = '编辑'
      this.addModal.type = 'edit'
      this.addModal.show = true
      this.addModal.formData = deepClone(form)
    },

    // 新建保存
    editTaskConfigFun() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.gender = Number(this.addModal.formData.gender)
          formData.traffic_type = Number(this.addModal.formData.traffic_type)
          formData.mod = Number(this.addModal.formData.mod)
          formData.is_short_url = Number(this.addModal.formData.is_short_url)
          formData.execute_mode = Number(this.addModal.formData.execute_mode)
          formData.button_code = Number(this.addModal.formData.button_code)
          if (this.addModal.type === 'add') {
            formData.ptype = 1
          } else {
            formData.ptype = 2
          }
          addAndEditTaskConfigApi(formData).then(res => {
            if (res.msg === 'success') {
              successTips(this)
              this.closeModal()
              this.getTaskConfigFun()
              this.addModal.isLoading = false
            } else {
              this.addModal.isLoading = false
            }
          })
        }
      })
    },
    // 关闭
    closeModal() {
      this.addModal.show = false
      setTimeout(() => {
        this.addModal.formData = {
          age: [],
          gender: '1',
          traffic_type: '',
        }
        this.$refs.refAddModal.resetFields();
      }, 500);
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.item.label === '批量删除') {
        this.delDataFun(null)
      } else if (command.item.label === '批量关闭') {
        this.batchCloseDataFun()
      }
    },
    // 删除
    delDataFun(form) {
      this.$confirm(`确认删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ptype: 3,
              del_id: form ? [form.id] : this.selectIdData,// 要删除与的id集合
            }
            addAndEditTaskConfigApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getTaskConfigFun()
                instance.confirmButtonLoading = false;
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    getLabelArrByVal,
    getLabelByVal,
    formatTimestamp
  }
}
</script>

<style lang="scss" scoped>
.taskConfig {
  width: 100%;
  height: 100%;
  float: left;
  position: relative;

}

.content {
  border: rgba(0, 0, 0, 0.1);
  background: #FFFFFF;
}

</style>
