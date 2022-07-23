<template>
  <view class="home-main">
    <!-- 轮播图 -->
    <u-swiper height="320" name="img_url" :list="swiperList"></u-swiper>
    <!-- 选项卡 -->
    <u-sticky :enable="stickyEnable">
      <view class="tabs u-p-10">
        <u-tabs
          active-color="#5592f8"
          :bar-width="80"
          :bar-height="6"
          :duration="0.3"
          :is-scroll="false"
          :list="tabsList"
          :current="currentTab"
          @change="handleTabsChange"
        ></u-tabs>
      </view>
    </u-sticky>
    <!-- 商品列表 -->
    <goods-list :goods-list="goodsList" :loading="isLoading"></goods-list>
    <!-- 加载更多 -->
    <u-loadmore
      class="u-p-t-40 u-p-b-60"
      :status="loadStatus"
      :load-text="loadText"
      @loadmore="handleLoadMoreClick"
    />
    <!-- 返回顶部 -->
    <u-back-top :scroll-top="scrollTop"></u-back-top>
  </view>
</template>

<script>
export default {
  name: 'HomeMain',
  data() {
    return {
      tabsList: [
        {
          name: '默认'
        },
        {
          name: '销量',
          type: 'sales'
        },
        {
          name: '推荐',
          type: 'recommend'
        },
        {
          name: '最新',
          type: 'new'
        }
      ],
      swiperList: [],
      goodsList: [],
      currentTab: 0,
      currentPage: 0,
      hasMore: true,
      isLoading: false,
      loadText: {
        loadmore: '点击或上拉加载更多',
        loading: '正在加载',
        nomore: '没有更多了'
      },
      stickyEnable: true,
      scrollTop: 0
    }
  },
  computed: {
    loadStatus() {
      if (this.isLoading) {
        return 'loading'
      } else if (this.hasMore) {
        return 'loadmore'
      } else {
        return 'nomore'
      }
    }
  },
  methods: {
    async getHomeList() {
      if (this.isLoading || !this.hasMore) {
        return
      }
      this.isLoading = true
      const data = {
        page: ++this.currentPage
      }
      const type = this.tabsList[this.currentTab].type
      if (type) {
        data[type] = 1
      }
      try {
        const res = await this.$_api.home.getList(data)
        this.swiperList = res.slides
        this.goodsList = [...this.goodsList, ...res.goods.data]
        if (res.goods.data.length === 0) {
          this.hasMore = false
        }
      } finally {
        this.isLoading = false
      }
    },
    handleTabsChange(event) {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      this.goodsList = []
      this.currentTab = event
      this.currentPage = 0
      this.hasMore = true
      this.getHomeList()
    },
    handleLoadMoreClick() {
      this.getHomeList()
    }
  },
  onShow() {
    if (!this.swiperList.length) {
      this.getHomeList()
    }
    this.stickyEnable = true
  },
  onHide() {
    this.stickyEnable = false
  },
  onReachBottom() {
    this.getHomeList()
  },
  onPageScroll(event) {
    this.scrollTop = event.scrollTop
  }
}
</script>

<style scoped lang="scss">
.home-main {
  .tabs {
    background-color: #fff;
  }
}
</style>
