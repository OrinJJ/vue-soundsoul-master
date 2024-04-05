<template>
  <div>
    <TouBu></TouBu>
    <el-tabs :tab-position="tabPosition" style="height: 670px;">
      <el-tab-pane label="发现音乐" class="tab">
        <!-- 轮播图-->
        <el-carousel :interval="4000" type="card" height="240px">
          <el-carousel-item v-for="(item, index) in banners" :key="index">
            <el-image :src="item.imageUrl" class="images" />
          </el-carousel-item>
        </el-carousel>
        <!-- 推荐歌单-->
        <div class="tuijian">推荐歌单</div>
        <div class="gedan">
          <ul>
            <li
              v-for="(item, index) in list"
              :key="index"
              @click="gedanbofang(item.id)"
            >
              <div class="div1">{{ item.copywriter }}</div>
              <img :src="item.picUrl" alt class="fengmian" />
              <span class="span2">{{ item.name }}</span>
              <img src="../assets/bofang.png" alt class="bofang" />
            </li>
          </ul>
        </div>

        <div class="tuijianMusic">最新音乐</div>
        <div class="danqu">
          <div
            v-for="(item, index) in songs"
            :key="index"
            @click="playMusic(item.id)"
          >
            <img :src="item.picUrl" />
            <span>{{ item.name }}</span>
            <span>{{ item.song.artists[0].name }}</span>
          </div>
        </div>
        <div class="tuijian">推荐MV</div>
        <div class="mvzhuYe">
          <div
            v-for="(item, index) in mvs"
            :key="index"
            @click="mvbofang(item.id)"
          >
            <img :src="item.picUrl" alt />
            <span>{{ item.copywriter }}</span>
            <span>{{ item.artists[0].name }}</span>
            <i class="cishu">播放次数：{{ item.playCount }}</i>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="最新音乐" class="tab">
        <YinYue></YinYue>
      </el-tab-pane>
      <el-tab-pane label="最新MV" class="tab"><MV></MV> </el-tab-pane>
    </el-tabs>
    <!-- 音乐播放条 -->
    <!-- <div id="DiscoverMusic" style="width:600px;">
      <aplayer :music="videoUpload.music"></aplayer>
    </div> -->
  </div>
</template>

<script>
import shousuo from "@/components/ShouSuo";
import YinYue from "@/components/YinYue";
import toubu from "@/components/TouBu";
import aplayer from "vue-aplayer";
import mv from "@/components/MV";
import axios from "axios";

export default {
  name: "DiscoverMusic",
  components: {
    shousuo: shousuo,
    YinYue: YinYue,
    TouBu: toubu,
    aplayer: aplayer,
    MV: mv
  },
  data() {
    return {
      tabPosition: "left",
      dizhi: "",
      banners: [],
      list: [],
      songs: [],
      mvs: []
      // videoUpload: {
      //   //progress: false,
      //   // progressPercent: 0,
      //   // successPercent: 0,
      //   theme: "#ffc0cb",
      //   autoplay: true,
      //   repeat: "repeat-one", // 轮播模式。值可以是 'repeat-one'（单曲循环）'repeat-all'（列表循环）或者 'no-repeat'（不循环）。为了好记，还可以使用对应的 'music' 'list' 'none'
      //   mini: true, // 迷你模式
      //   float: true, // 浮动模式。你可以在页面上随意拖放你的播放器
      //   music: {
      //     // 当前播放的音乐
      //     title: "能够成家吗",
      //     artist: "咖啡少年",
      //     src: require("../assets/music.mp3")
      //     //val即为传递过来的值
      //     // src: eventBus.$on("dizhi", item => {
      //     //   this.src = item;
      //     //   console.log("音乐传值=>发现音乐(主界面)", this.src);
      //     // })
      //     // pic:
      //     //   "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2366432289,1795558543&fm=26&gp=0.jpg" // 封面图片
      //   }
      // }
    };
  },
  created() {
    /* 轮播图 */
    axios({
      url: "https://autumnfish.cn/banner",
      method: "get"
    }).then(res => {
      this.banners = res.data.banners;
    });
    /* 推荐歌单 */
    axios({
      url: "https://autumnfish.cn/personalized",
      method: "get",
      params: {
        limit: 10
      }
    }).then(res => {
      this.list = res.data.result;
    });
    axios({
      url: "https://autumnfish.cn/personalized/newsong",
      method: "get"
    }).then(res => {
      this.songs = res.data.result;
    });
    axios({
      url: "https://autumnfish.cn/personalized/mv",
      method: "get"
    }).then(res => {
      this.mvs = res.data.result;
    });
  },
  methods: {
    playMusic(id) {
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id: id
        }
      }).then(res => {
        let url = res.data.data[0].url;
        /* 把歌曲地址存起来，然后传给其父组件（播放器所在的组件） */
        console.log("url主页:", url);
        eventBus.$emit("dizhi", url);
      });
    },
    mvbofang(id) {
      this.$router.push(`/MVBF?q=${id}`);
    }
  }
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.tab {
  font-size: 20px;
}

.title {
  height: 40px;
  width: 400px;
  font-weight: bolder;
  font-size: 20px;
  position: relative;
  left: 15px;
}

.carousel {
  margin-top: 10px;
  width: 800px;
}
.el-row {
  margin-bottom: 30px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  height: 100%;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 130px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

/*
   /deep/ 强制渲染
*/
/deep/.el-tabs {
  .el-tabs__item {
    font-size: 18px;
    margin-top: 40px;
  }
}

.el-tabs--card {
  height: calc(100vh - 10px);
  overflow-y: auto;
}
.el-tab-pane {
  height: calc(100vh - 65px);
  overflow-y: auto;
}
::v-deep .el-tabs__content {
  overflow: visible;
  height: screenwidth;
}

#DiscoverMusic {
  float: left;
  width: 1600px;
  height: 50px;
  background-color: rgb(241, 243, 244);
}
#DiscoverMusic audio {
  width: 100%;
  height: 100%;
  outline: none;
}

#app
  > div
  > div.DiscoverMusic
  > div
  > div.aplayer-body
  > div.aplayer-info
  > div.aplayer-music {
  position: relative;
  bottom: 200px;
}

.el-carousel {
  margin: 0 auto;
  margin-top: 20px;
  width: 900px;
}
.el-carousel__item img {
  width: 100%;
  height: 100%;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.tuijian {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  font-size: 20px;
  line-height: 50px;
  font-weight: bold;
  text-indent: 2em;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
}

.gedan {
  margin: 0 0 0 30px;
  margin-top: 10px;
  width: 1300px;
  height: 400px;
}
.gedan li {
  float: left;
  position: relative;
  margin-left: 75px;
  width: 170px;
  height: 230px;
  cursor: pointer;
  list-style: none;
  overflow: hidden;
}
.div1 {
  position: absolute;
  top: -30px;
  left: 0px;
  height: 30px;
  width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(224, 218, 218);
  background-color: rgba(15, 15, 15, 0.8);
  transition: all 0.8s;
}
.gedan li:hover .div1 {
  top: 0px;
}
.gedan li:hover {
  opacity: 0.9;
}
.span2 {
  float: left;
  height: 30px;
  width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
}
.fengmian {
  float: left;
  width: 170px;
  height: 170px;
}
.bofang {
  position: absolute;
  bottom: -30px;
  right: -38px;
  width: 30px;
  height: 30px;
  transition: all 0.5s;
}
.gedan li:hover .bofang {
  right: 8px;
  bottom: 38px;
}
/* 最新单曲 */
.danqu {
  margin: 0 auto;
  margin-top: 20px;
  width: 1300px;
  height: 323px;
  overflow: hidden;
  margin-left: 135px;
}
.danqu div {
  float: left;
  margin-left: 10px;
  margin-bottom: 10px;
  position: relative;
  width: 300px;
  height: 100px;
  background-color: rgb(255, 251, 251);
  cursor: pointer;
}
.danqu div:hover {
  background-color: rgb(233, 230, 230);
  box-shadow: 1px 1px 1px rgba(31, 30, 30, 0.9);
}
.danqu div::after {
  content: "";
  position: absolute;
  top: 50px;
  left: 50px;
  width: 0px;
  height: 0px;
  background-position: 50% 50%;
  transition: all 0.3s;
}
.danqu div:hover:after {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 100px;
  background-image: url("../assets/bofang.png");
  background-size: 30% 30%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: rgb(13, 13, 14, 0.6);
}
.danqu img {
  float: left;
  position: relative;
  width: 100px;
  height: 100px;
}

.danqu span {
  float: left;
  width: 200px;
  height: 50px;
  line-height: 50px;
  text-indent: 1em;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.danqu span:last-of-type {
  color: rgb(136, 128, 128);
  font-size: 11px;
}

/* 推荐mv */
.mvzhuYe {
  margin: 0 auto;
  margin-top: 20px;
  width: 960px;
  height: 200px;
  margin-left: 135px;
}

.mvzhuYe div {
  float: left;
  position: relative;
  margin-left: 10px;
  width: 230px;
  height: 200px;
  cursor: pointer;
  bottom: 45px;
}

.mvzhuYe div:last-child {
  margin-left: 80px;
}
.mvzhuYe img {
  float: left;
  width: 230px;
  height: 150px;
}
.mvzhuYe span {
  float: left;
  width: 230px;
  height: 25px;
  font-size: 15px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mvzhuYe > div span:last-of-type {
  font-size: 12px;
  color: rgb(175, 166, 166);
}
.mvzhuYe div::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0px;
  height: 0px;
  transition: all 0.2s;
}
.mvzhuYe div:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 230px;
  height: 150px;
  background-color: rgba(92, 90, 90, 0.5);
  background-image: url("../assets/bofang.png");
  background-repeat: no-repeat;
  background-size: 18% 30%;
  background-position: 50% 50%;
  box-shadow: 1px 1px 1px rgba(31, 30, 30, 0.9);
}
.cishu {
  position: absolute;
  top: 5px;
  right: 0px;
  height: 20px;
  width: 130px;
  font-weight: bold;
  font-size: 10px;
  color: rgb(95, 245, 10);
  font-style: normal;
}

.el-carousel__mask {
  width: 300px;
  height: 200px;
  border-radius: 10px;
}

.carousel_image_type {
  width: 100%;
}

.el-carousel {
  width: 1300px;
}

.tuijianMusic {
  position: relative;
  right: 1300px;
  top: 30px;
  font-size: 20px;
  font-weight: bold;
  text-indent: 2em;
}
</style>
