<!-- 查看任务 -->
<template>
  <el-dialog
    title="上传任务"
    center
    :visible.sync="taskModal.show"
    :close-on-click-modal="false"
    width="1200px"
    @close="closeTaskModal"
  >
    <div class="queryContent">
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
          <el-input v-model="taskModal.queryData.name" clearable placeholder="标题" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getTaskListFun(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <u-table
      ref="taskTable"
      v-loading="taskModal.loading"
      :data="taskModal.data"
      row-key="id"
      use-virtual
      border
      :height="600"
      element-loading-spinner="el-icon-loading"
      style="width: 100%;"
      show-body-overflow="title"
      :total="taskModal.queryData.total"
      :page-sizes="pageOption"
      :page-size="taskModal.queryData.limit"
      :current-page="taskModal.queryData.page"
      :pagination-show="true"
      @handlePageSize="switchTaskPage"
    >
      <u-table-column type="index" label="序号" width="60" />
      <!--      <u-table-column type="selection" width="55" :reserve-selection="true" />-->
      <u-table-column prop="group_name" label="分组名称" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.group_name ?scope.row.group_name : '-' }}
        </template>
      </u-table-column>
      <u-table-column prop="name" label="标题" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.name ? scope.row.name : '-' }}
        </template>
      </u-table-column>
      <u-table-column prop="desc" label="描述" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.desc ? scope.row.desc : '-' }}
        </template>
      </u-table-column>
      <u-table-column prop="file_name" label="素材名称" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.file_name ? scope.row.file_name : '-' }}
        </template>
      </u-table-column>
      <u-table-column prop="status" label="任务状态" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.status ===1? '进行中' : '已完成' }}
        </template>
      </u-table-column>
      <u-table-column prop="total_num" label="总数量" min-width="100" />
      <u-table-column prop="success_num" show-overflow-tooltip label="成功数量" min-width="100" />
      <u-table-column prop="fail_num" show-overflow-tooltip label="失败数量" min-width="100" />
      <u-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ formatTimestamp(scope.row.itime) }}
        </template>
      </u-table-column>

    </u-table>
  </el-dialog>
</template>

<script>
import { resetPage } from '@/utils';
import { getMaterialApi } from '@/views/content/materialApi';
import { formatTimestamp } from '@/filters'

export default {
  name: 'TaskModal',
  data() {
    return {
      taskModal: {
        show: false,
        title: '',
        type: '',
        loading: false,
        queryData: {
          name: '',
          page: 1,
          limit: 100,
          total: 0,
        },
        data: []
      },
      pageOption: resetPage(),
    }
  },
  methods: {
    //
    open() {
      this.taskModal.show = true
      this.getTaskListFun()
    },
    // 获取列表
    getTaskListFun(num) {
      this.taskModal.loading = true
      const params = {
        name: this.taskModal.queryData.name,
        page: num || this.taskModal.queryData.page,
        limit: this.taskModal.queryData.limit
      }
      getMaterialApi(params).then(res => {
        if (res.msg === 'success') {
          this.taskModal.data = res.data.list
          this.taskModal.queryData.total = res.data.total
          this.taskModal.loading = false
        }
      })
    },
    restQueryBtn() {
      this.taskModal.queryData.name = '';
      this.getTaskListFun(1)
    },
    // 切换页码
    switchTaskPage({ page, size }) {
      this.taskModal.loading = true
      if (this.taskModal.queryData.limit !== size) {
        this.taskModal.queryData.page = 1;
      } else {
        this.taskModal.queryData.page = page;
      }
      this.taskModal.queryData.limit = size;
      this.getTaskListFun();
    },
    // 关闭 查看任务
    closeTaskModal() {
      this.taskModal.show = false
      this.taskModal.queryData.name = ''
      this.taskModal.queryData.page = 1
    },
    formatTimestamp
  }
}
</script>

<style scoped>

</style>
