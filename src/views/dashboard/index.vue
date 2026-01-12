<template>
    <div class="work_continer">
        <div class="index-sales">
            <div class="index-head">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="14" :lg="12" :xl="12">
                        <div class="index-head-centent-left">
                            <img src="@/assets/login/avatar.png" alt="" srcset=""
                                style="width: 46px;height: 46px;border-radius: 50%; overflow: hidden; margin-right: 10px;"
                                :size="56">
                            <!-- <el-avatar style="margin-right: 10px;" :size="56" src="@/assets/login/avatar.png"></el-avatar> -->
                            <div class="index-head-centent-left-text">
                                <p>{{$t('sys_m053',{value:userInfo.account})}}</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- <div class="index-banner">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-carousel indicator-position="outside" interval="5000" height="480px">
                        <el-carousel-item v-for="item in bannerList" :key="item">
                            <img :src="item" alt="" srcset="">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </div> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    components: {},
    data() {
        return {
            bannerList: [require("../../assets/banner/banner1.jpg"), require("../../assets/banner/banner2.jpg")]
        }
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() { },
    mounted() { },
    methods: {},
    destroyed() { }
}
</script>

<style lang="scss" scoped>
.work_continer {
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    background: #F5F7F9;

    .el-icon-refresh {
        font-size: 16px;
    }

    .rotate_oading {
        animation: rotate 1s ease-in-out infinite;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    .upload_file {
        display: flex;
        width: 80px;
        height: 44px;
        overflow: hidden;
        position: relative;
        /* background:#D0EEFF;
        border:1px solid #99D3F5; */
        border-radius: 4px;
        padding: 4px 0;
        color: #000;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    input[type='file'] {
        width: 100%;
        height: 44px;
        opacity: 0;
        appearance: none;
        background-color: #c1c1c1;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .index-sales {
        display: flex;
        width: 100%;
        padding: 0 15px 15px 15px;
        box-sizing: border-box;
        border-radius: 5px;
        background: #ffffff;
        margin-bottom: 20px;
        flex-direction: column;
        justify-content: center;

        .record_list {
            width: 100%;
            // height:calc(100% - 460px);
            // height: 300px;
            flex-direction: column;

            .gva-pagination {
                margin-top: 10px;
            }
        }

        .plant_continer {
            width: 100%;
            display: flex;
            gap: 30px;
            padding: 20px 0 20px 0;
            white-space: normal;
            flex-wrap: wrap;

            .plant_list {
                width: 234px;
                display: flex;
                flex-shrink: 0;
                padding: 14px 14px;
                box-sizing: border-box;
                flex-direction: column;
                border-radius: 4px;
                background: #ecf5ff;

                .title_el {
                    font-size: 16px;
                    font-weight: 600;
                }

                .icon_svg {
                    width: 32px;
                    height: 32px;
                    color: #e6a23c;
                    fill: currentColor;
                }

                .item_el {
                    width: 100%;
                    display: flex;
                    font-size: 14px;
                    margin-top: 20px;
                    align-items: center;
                    justify-content: space-between;

                    .down_el {
                        cursor: pointer;
                    }

                    .upload_fiel {
                        display: flex;
                        position: relative;

                        .el-button {
                            color: #000;
                            display: flex;
                            align-items: center;
                            border-color: transparent;
                            flex-direction: column;
                            background-color: transparent;
                        }

                        ::v-deep .el-upload-list {
                            top: -40px;
                            right: 0;
                            position: absolute;
                        }
                    }

                    ::v-deep .el-upload-dragger {
                        width: auto;
                        height: auto;
                        border: none;
                        background: transparent;
                    }

                    ::v-deep .el-icon-upload {
                        color: #b3d8ff;
                        margin: 0;
                        line-height: initial;
                        font-size: 32px;
                    }

                    .el-upload__text {
                        color: #000;
                    }
                }
            }

            .plant_list:hover {
                box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
                // box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
                // box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
            }
        }

        .footer_text {
            width: 100%;
            margin-top: 20px;

            .tips_text {
                width: 100%;
                color: #f56c6c;
            }
        }
    }
}

.index {
    width: 100%;
    min-height: 100%;
}

.index-head {
    width: 100%;
    /* height: 133px; */
    padding: 16px 32px 0 0;
    box-sizing: border-box;
    background: rgba(255, 255, 255, .7);
    border-bottom: 1px solid #dcdfe6;
}

.index-banner {
    img{
        width: 100%;
        height: auto;
    }
}

.index-head-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    color: #292929;
    margin-bottom: 16px;
}

.index-head-centent-left {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.index-head-centent-left-text {
    display: flex;
    height: 56px;
    align-items: center;
}

.index-head-centent-right {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .agent-num {
        height: 100%;
        display: flex;
        font-weight: 600;
        margin: 3px 0 0 10px;
        align-items: center;
    }
}

.icon-i {
    width: 14px;
    height: 14px;
    fill: currentColor;
    margin-right: 5px;
    padding: 5px;
    border-radius: 12px;
}

.index-centent {
    width: 100%;
    min-height: 100%;
    padding: 25px;
    box-sizing: border-box;
}


.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
    background: #ffffff;
    width: 100%;
    margin-bottom: 25px;
}

.index-centent-title {
    width: 100%;
    height: 52px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px;
    box-sizing: border-box;
    justify-content: space-between;
    font-size: 14px;
}

.index-centent-title-left {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    /* border-radius: 11px;
    overflow: hidden; */
}

.index-centent-title-left-icon {
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #1890FF;
    padding: 5px;
    background: #E6F3FE;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}

.index-centent-title-left-icontwo {
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #F371FA;
    padding: 5px;
    background: #FDF4FD;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}

.index-centent-title-left-iconthree {
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #FC1D1D;
    padding: 5px;
    background: #FDF4FD;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}

.index-centent-title-left-iconfour {
    width: 12px;
    height: 12px;
    font-size: 12px;
    color: #18B2FA;
    padding: 5px;
    background: #FDF4FD;
    /* border-radius: 11px; */
    fill: currentColor;
    margin-right: 10px;
}

.index-centent-title-right {
    color: #3CA0FD;
    cursor: pointer;
}

.index-centent-box {
    width: 100%;
    padding: 15px 15px 0;
    box-sizing: border-box;
}
</style>