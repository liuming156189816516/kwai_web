<!-- 投放订单 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.tk_account" clearable placeholder="请输入TK账号" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.order_id" clearable placeholder="请输入订单号" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form v-if="false" :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun('add')">新建任务</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in batchOption" v-show="item.label" :key="idx" :command="{item,idx}">
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        ref="serveTable"
        v-loading="loading"
        :data="tableData"
        :height="cliHeight"
        border
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
        @sort-change="handleSortChange"
      >

        <el-table-column :selectable="selectable" type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="主键ID" min-width="120" prop="id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="TK账号" min-width="120" prop="tk_account" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="订单号" min-width="120" prop="order_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="投放任务id" min-width="120" prop="task_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="任务详情id" min-width="120" prop="task_info_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="投放原链" min-width="120" prop="link" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="素材id" min-width="120" prop="material_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="VideoId" min-width="120" prop="video_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="投放金额" prop="amount" min-width="100">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="流量类型" min-width="120" prop="traffic_type" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ===1 ? '便宜': scope.row[scope.column.property] ===2 ?'贵':'-' }}
          </template>
        </el-table-column>
        <el-table-column label="投放国家" min-width="100" prop="country_code">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="投放性别" min-width="100" prop="gender_desc">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="投放年龄" min-width="100" prop="age_desc">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="120" prop="order_status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'order_status','table')">
              <span :class="[Number(queryData.order_status) > 0?'dropdown_title':'']" style="color:#909399">
                订单状态  <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in statusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.order_status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <!--            <el-tag :type="getLabelByVal(scope.row[scope.column.property], statusList,{label:'type',value:'value'})" size="small">-->
            {{ getLabelByVal(scope.row[scope.column.property], statusList) || '-' }}
            <!--            </el-tag>-->
          </template>
        </el-table-column>
        <el-table-column label="消耗量" min-width="120" prop="consumption_num" sortable="custom" />
        <el-table-column label="曝光量（千次展示）" min-width="180" prop="exposure_num" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : 0 }} （{{ scope.row.cpm }}u）
          </template>
        </el-table-column>
        <el-table-column label="点击量（点击率）" min-width="170" prop="click_num" sortable="custom">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : 0 }}（{{ scope.row.ctr }}%）
          </template>
        </el-table-column>
        <el-table-column label="完播率" min-width="130" prop="watch_rate" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : 0 }}%
          </template>
        </el-table-column>
        <el-table-column label="活码链接" min-width="120" prop="live_link" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="所属用户" min-width="120" prop="faccount">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>

      </el-table>

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

    <!-- 视频弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="videoModal.title"
      :visible.sync="videoModal.show"
      center
      style="border-radius: 20px"
      width="25%"
      @close="closeVideoModal"
    >
      <div class="video_content">
        <VideoPlayer
          ref="refVideoPlayer"
          :autoplay="false"
          :src="videoModal.url"
        />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDataApi } from './api';
import { resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp, getFileExtension } from '@/filters'
import VideoPlayer from '@/components/VideoPlayer'

export default {
  name: 'GroupServer',
  components: {
    VideoPlayer,
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        order_id: '',
        order_status: '-1',
        tk_account: '',
        sort: ''
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: null,
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      total: 0,
      isLoading: false,
      statusList: [
        {
          label: '全部',
          value: '0',
          type: '',
        },
        {
          label: '待审核',
          value: '1',
          type: '',
        },
        {
          label: '投放中',
          value: '2',
          type: '',
        },
        {
          label: '拒绝',
          value: '3',
          type: '',
        },
        {
          label: '完成',
          value: '4',
          type: 'success',
        },
        {
          label: '关闭',
          value: '5',
          type: 'success',
        },
      ],
      materialGroupList: [],
      setBatchData: {
        show: false,
        title: '',
        type: -1,
      },
      batchOption: [
        {
          icon: 'delete',
          label: '批量删除'
        },
      ],
      videoModal: {
        title: '',
        show: false,
        url: ''
      },
    }
  },
  mounted() {
    this.getDataListFun(1); // 获取列表
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表
    getDataListFun(num) {
      this.loading = true;
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        order_id: this.queryData.order_id,
        tk_account: this.queryData.tk_account,
        order_status: Number(this.queryData.order_status) || -1,
        sort: this.queryData.sort,

      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.order_status = item.order_status ? String(item.order_status) : ''
            return item
          });
          this.selectData = []
          this.selectIdData = []
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      })
    },
    // 对数据 禁用选择
    selectable(row, index) {
      return true// row.status === '4'
    },
    // 新建
    addOpenFun(type) { },
    // 关闭新建
    closeModal() {

    },
    // 新建保存
    addSubmit() {
      /*
      this.$refs.refAddModal.validate((v) => {
        if (v) {
        }
      })
      */
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.item.label === '批量删除') {
        this.delDataFun()
      }
    },
    // 删除
    delDataFun() {
      /*
      this.$confirm(`确认删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ptype: 3,
              del_id: this.selectIdData,// 要删除与的id集合
            }
            successTips(this)
            this.getDataListFun()
            instance.confirmButtonLoading = false;
            done();
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
      */
    },
    // 预览视频
    openFileFun(row) {
      const suffixArr = ['mp4']
      const suffix = getFileExtension(row.material_url)
      if (suffixArr.includes(suffix)) {
        this.videoModal.show = true
        this.videoModal.title = row.material_name
        this.videoModal.url = row.material_url
      } else {
        successTips(this, 'error', '仅支持查看 .mp4 格式的视频')
      }
    },
    // 关闭视频弹窗
    closeVideoModal() {
      this.videoModal.show = false
      this.videoModal.title = ''
      this.videoModal.url = ''
      this.$refs.refVideoPlayer.closePausePlay()
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 筛选项
    handleSortChange({ column, prop, order }) {
      console.log('order',order)
      if (order === 'descending') { // 下降 倒序
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = '-' + prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = '-' + prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = '-' + prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = '-' + prop
            break;
        }
      } else if (order === 'ascending') { // 上升 = 正序
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = prop
            break;
        }
      } else {
        this.queryData.sort = ''
      }
      this.getDataListFun()
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 240;
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
      console.log('this.selectIdData',this.selectIdData)
    },
    // 行内筛选项
    handleRowQuery(val, key, type) {
      if (type === 'table') {
        this.queryData[key] = val
        this.getDataListFun()
      }
    },
    // 重置
    restQueryBtn(type) {
      switch (type) {
        case 1:
          this.queryData.order_id = ''
          this.queryData.tk_account = ''
          this.queryData.order_status = -1
          this.queryData.sort = ''
          this.getDataListFun(1)
          this.$refs.serveTable.clearSort()
          break;
      }
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      }
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp,
    getLabelByVal

  }
}
</script>

<style lang="scss" scoped>
.addModalName {
  ::v-deep .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

  }

  ::v-deep .el-form-item {
    width: 48%;
  }
}

.file_content {
  cursor: pointer;
  color: #0a76a4;
  text-decoration: underline;
  font-size: 25px;
}
</style>
