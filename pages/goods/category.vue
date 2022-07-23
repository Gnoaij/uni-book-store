<template>
  <view class="goods-category">
    <view class="search-box u-flex u-col-center u-p-l-15 u-p-r-15">
      <u-search
        v-model="keywords"
        height="56"
        placeholder="请输入关键字"
        animation
        @custom="handleSearchClick"
      ></u-search>
    </view>
    <view class="scroll-wrap u-flex">
      <!-- 分类菜单 -->
      <scroll-view
        class="scroll-left"
        scroll-y
        scroll-with-animation
        :scroll-into-view="'child_' + currentId"
      >
        <view v-for="item in categories" :key="item.id">
          <view class="first-level u-p-t-10 u-p-b-10 u-p-l-15 u-p-r-15 u-font-28 u-line-1">
            {{ item.name }}
          </view>
          <view v-for="child in item.children" :key="child.id">
            <view
              class="second-level u-p-t-30 u-p-b-30 u-p-l-5 u-p-r-5 u-font-26 u-line-1 u-text-center"
              :class="child.id === currentId ? 'active' : ''"
              :id="'child_' + child.id"
              @click="handleMenuClick(child.id)"
            >
              {{ child.name }}
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- 图书列表 -->
      <scroll-view
        class="scroll-right u-flex-1 u-p-l-16 u-p-r-16"
        scroll-y
        :lower-threshold="10"
        @scrolltolower="handleScrollToLower"
      >
        <view class="content">
          <u-grid :col="2" :border="false" align="center" @click="handleItemClick">
            <u-grid-item v-for="(item, index) in goodsList" :key="index" :index="item.id">
              <u-image width="120" height="120" mode="aspectFit" :src="item.cover_url">
                <u-loading slot="loading"></u-loading>
              </u-image>
              <view class="title u-font-26">{{ item.title }}</view>
            </u-grid-item>
          </u-grid>
          <u-loadmore
            class="u-p-t-30 u-p-b-40"
            :status="loadStatus"
            :load-text="loadText"
            @loadmore="handleLoadMoreClick"
          />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsCategory',
  data() {
    return {
      categories: [],
      goodsList: [],
      keywords: '',
      currentId: 0,
      currentPage: 0,
      hasMore: true,
      loading: false,
      loadText: {
        loadmore: '点击或上拉加载更多',
        loading: '正在加载',
        nomore: '没有更多了'
      }
    }
  },
  computed: {
    loadStatus() {
      if (this.loading) {
        return 'loading'
      } else if (this.hasMore) {
        return 'loadmore'
      } else {
        return 'nomore'
      }
    }
  },
  methods: {
    async getGoodsList() {
      if (this.loading || !this.hasMore) {
        return
      }
      this.loading = true
      const data = {
        category_id: this.currentId,
        page: ++this.currentPage
      }
      if (this.keywords) {
        data.title = this.keywords
      }
      try {
        const res = await this.$_api.goods.getList(data)
        this.categories = res.categories
        this.goodsList = [...this.goodsList, ...res.goods.data]
        if (res.goods.data.length === 0) {
          this.hasMore = false
        }
      } finally {
        this.loading = false
      }
    },
    handleSearchClick() {
      this.goodsList = []
      this.currentId = 0
      this.currentPage = 0
      this.hasMore = true
      this.getGoodsList()
    },
    handleMenuClick(event) {
      this.goodsList = []
      this.keywords = ''
      this.currentId = event
      this.currentPage = 0
      this.hasMore = true
      this.getGoodsList()
    },
    handleLoadMoreClick() {
      this.getGoodsList()
    },
    handleScrollToLower() {
      this.getGoodsList()
    },
    handleItemClick(event) {
      this.$_router.navigateTo({
        url: '/pages/goods/info',
        options: {
          id: event
        }
      })
    }
  },
  onShow() {
    if (!this.categories.length) {
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-category {
  .search-box {
    height: 80rpx;
  }

  .scroll-wrap {
    height: calc(100vh - 80rpx - var(--window-top) - var(--window-bottom));

    .scroll-left {
      width: 160rpx;
      height: 100%;
      background-color: #f6f6f6;
      box-sizing: border-box;

      .first-level {
        font-weight: 600;
        color: #fff;
        background-color: #2979ff;
      }

      .second-level {
        &.active {
          font-size: 28rpx;
          font-weight: 600;
          color: #000;
          background-color: #fff;
          border-left: 8rpx solid #97abcd;
        }
      }
    }

    .scroll-right {
      height: 100%;
      background-color: #fafafa;
      box-sizing: border-box;

      .content {
        height: 100%;
        background-color: #fff;

        .title {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
