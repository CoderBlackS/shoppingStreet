<template>
  <div id="detail">
    <detail-nav-bar ref="detailNavBar" class="detail-nav" @titleClick="titleClick"></detail-nav-bar>
    <scroll :probe-type="3" @scroll="betterScroll" class="content" ref="scroll">
      <detail-swiper :swiperImage="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imgLoad="imgLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list ref="recommend" :goods="goodsList"></goods-list>
    </scroll>

      <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @backClick="backClick" v-show="isShow"></back-top>
    <toast :is-show="isShowed" :message="message"></toast>
  </div>
</template>

<script>
import DetailSwiper from "./childrenComps/DetailSwiper";
import DetailNavBar from "./childrenComps/DetailNavBar";
import DetailBaseInfo from "./childrenComps/DetailBaseInfo";
import DetailShopInfo from "./childrenComps/DetailShopInfo";
import DetailGoodsInfo from "./childrenComps/DetailGoodsInfo";
import DetailParamInfo from "./childrenComps/DetailParamInfo";
import DetailCommentInfo from "./childrenComps/DetailCommentInfo";
import DetailBottomBar from "./childrenComps/DetailBottomBar";
import Scroll from "../../components/common/scroll/Scroll";
import {getDetailData, Goods, Shop, GoodsParam, getRecommend} from "../../network/detail";
import {debounce} from "../../common/utils";
import {itemlistenerMinXin,backtopMinXin} from "../../common/mixin";
import GoodsList from "../../components/content/goods/GoodsList";
import {mapActions, mapGetters} from "vuex";
import Toast from "../../components/common/toast/Toast";
export default {
  name: "Detail",
  mixins:[itemlistenerMinXin,backtopMinXin],
  data() {
    return {
      id: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      goodsList: [],
      commentInfo: {},
      themTopYs:[],
      isShowed:false,
      message:''
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Toast
  },
  methods: {
    ...mapActions(['addCart']),
    async _getDetailData(){
      let{result:{itemInfo,columns,shopInfo,detailInfo,itemParams,rate}}=await getDetailData(this.id);
      this.topImages =itemInfo.topImages;
      this.goods=new Goods(itemInfo,columns,shopInfo.servies);
      this.shop = new Shop(shopInfo);
      this.paramInfo = new GoodsParam(itemParams.info,itemParams.rule);
      this.detailInfo = detailInfo;
      this.commentInfo =rate.list[0];
    },
    betterScroll(position) {
      (-position.y)>1000?this.isShow=true:this.isShow=false;
      for(let i=0; i<this.themTopYs.length-1;i++){ //i str
        if((-position.y)>=this.themTopYs[i]&&(-position.y)<this.themTopYs[i+1]){
            this.$refs.detailNavBar.activeIndex = i;
        }
      }
    },
    addToCart(){
      //获取购物车需要展示的信息
       const product ={};
       product.image = this.topImages[0];
       product.desc = this.goods.desc;
       product.title = this.goods.title;
       product.price = this.goods.newPrice;
       product.id = this.id;
       product.realPrice = this.goods.realPrice;
       // this.$store.dispatch('addCart',product).then(res=>{
       //   console.log(res);
       // });
       this.addCart(product).then(res=>{
         this.isShowed=true;
         this.message=res;
         let that = this;
         setTimeout(()=>{
           that.isShowed = false;
         },1000);
       });
       // this.$store.commit('addCart',product);
    },
    imgLoad(){
      this.$refs.scroll.refresh();
      this.themTopYs.push(0)
      this.themTopYs.push(this.$refs.param.$el.offsetTop)
      this.themTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themTopYs.push(Number.MAX_VALUE);
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0,-this.themTopYs[index],300);
    },
    //监听图片加载事件并且触发刷新
    // imgLoad(){
    //   this.$refs.scroll.refresh();
    // },
    _getRecommend() {
      getRecommend().then(res => {
        this.goodsList.push(...res.data.list);
      })
    }
  },
  created() {
    this.id = this.$route.params.id;
    this._getDetailData();
    this._getRecommend();
  },
  destroyed() {
    this.$bus.$off('itemDetailLoad',this.itemImgListener);
  }
}
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 9;
  background-color: #ffffff;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);

}
</style>
