<template>
  <div class="mvbf" id="mvbf">
    <!--退出按钮-->
    <div class="button" @click="returnMV">
      <span>返回</span>
    </div>
    <div class="mvbf1">
      <div class="zuo">
        <div class="jianjie">MV详情</div>
        <div class="shiping">
          <video :src="url" controls></video>
        </div>
        <div class="touxiang">
          <img :src="icon" alt />
          &nbsp;{{ mvs.artistName }}
        </div>
        <div class="biaoti">{{ mvs.name }}</div>
        <div class="shijian">
          <span>时间：{{ mvs.publishTime }}</span>
          <span style="padding-left:20px">播放量：{{ mvs.playCount }}次</span>
        </div>
      </div>
      <div class="you">
        <div class="jianjie2">相关推荐</div>
        <div
          class="tuijian"
          v-for="(item, index) in tui"
          :key="index"
          @click="mvbofang(item.id)"
        >
          <span class="icon iconfont icon-shipin3">{{ item.playCount }}</span>
          <span>{{ item.duration }}</span>
          <img :src="item.cover" alt />
          <div>{{ item.name }}</div>
          <div>&nbsp;{{ item.artistName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "mvbf",
  data() {
    return {
      url: "",
      tui: [],
      mvs: {},
      icon: ""
    };
  },
  created() {
    /*  mv */
    axios({
      url: "https://autumnfish.cn/mv/url",
      method: "get",
      params: {
        id: this.$route.query.q
      }
    }).then(res => {
      this.url = res.data.data.url;
    });
    /* 相关推荐 */
    axios({
      url: "https://autumnfish.cn/simi/mv",
      method: "get",
      params: {
        mvid: this.$route.query.q
      }
    }).then(res => {
      this.tui = res.data.mvs;

      /* 毫秒转化为分秒 */
      for (let i = 0; i < this.tui.length; i++) {
        let duration = this.tui[i].duration;
        let min = parseInt(duration / 1000 / 60);
        if (min < 10) {
          min = "0" + min;
        }
        let miao = parseInt((duration / 1000) % 60);
        if (miao < 10) {
          miao = "0" + miao;
        }
        this.tui[i].duration = `${min}:${miao}`;
      }

      for (let i = 0; i < this.tui.length; i++) {
        if (this.tui[i].playCount > 10000) {
          this.tui[i].playCount =
            parseInt(this.tui[i].playCount / 10000) + "万";
        }
      }
    });
    /* mv的文字信息 */
    axios({
      url: "https://autumnfish.cn/mv/detail",
      method: "get",
      params: {
        mvid: this.$route.query.q
      }
    }).then(res => {
      this.mvs = res.data.data;

      if (this.mvs.playCount > 10000) {
        this.mvs.playCount = parseInt(this.mvs.playCount / 10000) + "万";
      }

      /* 获取头像 */
      axios({
        url: "https://autumnfish.cn/artists",
        method: "get",
        params: {
          id: this.mvs.artists[0].id
        }
      }).then(res => {
        this.icon = res.data.artist.picUrl;
      });
    });
  },
  methods: {
    mvbofang(id) {
      /*  mv */
      axios({
        url: "https://autumnfish.cn/mv/url",
        method: "get",
        params: {
          id
        }
      }).then(res => {
        this.url = res.data.data.url;
      });
      /* 相关推荐 */
      axios({
        url: "https://autumnfish.cn/simi/mv",
        method: "get",
        params: {
          mvid: id
        }
      }).then(res => {
        this.tui = res.data.mvs;

        /* 毫秒转化为分秒 */
        for (let i = 0; i < this.tui.length; i++) {
          let duration = this.tui[i].duration;
          let min = parseInt(duration / 1000 / 60);
          if (min < 10) {
            min = "0" + min;
          }
          let miao = parseInt((duration / 1000) % 60);
          if (miao < 10) {
            miao = "0" + miao;
          }
          this.tui[i].duration = `${min}:${miao}`;
        }

        for (let i = 0; i < this.tui.length; i++) {
          if (this.tui[i].playCount > 10000) {
            this.tui[i].playCount =
              parseInt(this.tui[i].playCount / 10000) + "万";
          }
        }
      });
      /* mv的文字信息 */
      axios({
        url: "https://autumnfish.cn/mv/detail",
        method: "get",
        params: {
          mvid: id
        }
      }).then(res => {
        this.mvs = res.data.data;
        /* 获取头像 */
        axios({
          url: "https://autumnfish.cn/artists",
          method: "get",
          params: {
            id: this.mvs.artists[0].id
          }
        }).then(res => {
          this.icon = res.data.artist.picUrl;
        });
      });
    },
    returnMV() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.mvbf {
  background-color: azure; /*天蓝色*/
}

.mvbf {
  float: left;
  position: relative;
  width: 1615px;
  height: 780px;
  overflow: hidden;
}
.mvbf1 {
  width: 1020px;
  height: 950px;
  overflow: auto;
}
.zuo {
  float: left;
  width: 650px;
  position: absolute;
  left: 140px;
  top: 20px;
}
.jianjie {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-indent: 5px;
  font-weight: 700;
  font-size: 20px;
  margin-top: 40px;
  margin: 20px 2px;
}
.shiping {
  width: 950px;
  height: 450px;
  cursor: pointer;
}
.shiping video {
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 8px 8px 8px 8px;
}
.touxiang {
  margin: 20px 25px;
  width: 600px;
  height: 60px;
  font-size: 19px;
}
.touxiang img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  vertical-align: middle;
}
.biaoti {
  margin: 10px 25px;
  width: 600px;
  height: 50px;
  font-size: 30px;
  line-height: 50px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.shijian {
  margin: 15px 25px;
  width: 600px;
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  color: rgb(124, 119, 119);
}
.jieshao {
  margin: 15px 25px;
  width: 600px;
  font-size: 13px;
  line-height: 20px;
}
.you {
  float: left;
  width: 300px;
  position: absolute;
  left: 1150px;
  top: 30px;
}
.jianjie2 {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-weight: 700;
  font-size: 20px;
}
.tuijian {
  position: relative;
  margin: 15px 2px;
  width: 340px;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
}
.tuijian:hover {
  box-shadow: 1px 1px 1px rgba(31, 30, 30, 0.9);
  background-color: rgba(158, 150, 150, 0.6);
}
.tuijian::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0px;
  height: 0px;
  background-position: 50% 50%;
  transition: all 0.3s;
}
.tuijian:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  background-image: url("../assets/bofang.png");
  background-repeat: no-repeat;
  background-size: 17% 30%;
  background-position: 50% 50%;
  background-color: rgba(19, 17, 17, 0.6);
}

.tuijian img {
  float: left;
  height: 120px;
  width: 200px;
  border-radius: 8px;
}
.tuijian span:first-of-type {
  position: absolute;
  top: 0;
  right: 145px;
  height: 30px;
  padding-left: 5px;
  padding-right: 5px;
  line-height: 30px;
  font-size: 15px;
  color: rgba(241, 247, 239, 0.9);
  background-color: rgba(26, 24, 24, 0.7);
  border-radius: 10px;
}
.tuijian span:last-of-type {
  position: absolute;
  bottom: 0;
  left: 0px;
  padding-left: 5px;
  padding-right: 5px;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  color: rgba(237, 241, 245, 0.9);
  background-color: rgba(26, 24, 24, 0.7);
  border-radius: 10px;
}
.tuijian div:first-of-type {
  float: left;
  margin-top: 30px;
  width: 140px;
  font-size: 16px;
  line-height: 20px;
  text-indent: 1em;
}
.tuijian div:last-of-type {
  float: left;
  width: 140px;
  line-height: 20px;
  font-size: 13px;
  text-indent: 1em;
  color: rgb(124, 119, 119);
}

/*退出按钮样式*/
.button {
  display: inline-block;
  border-radius: 10px;
  background-color: #dfe970;
  border: none;
  text-align: center;
  padding: 20px;
  width: 80px;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}
.button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
  color: white;
  font-size: 20px;
}
.button span:after {
  content: "\00bb"; /* CSS Entities. 如果用的是 HTML Entities, 请改成 &#8594;*/
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}
.button:hover span {
  padding-right: 25px;
}

/*箭头*/
.button:hover span:after {
  opacity: 1;
  right: 0;
}
</style>
