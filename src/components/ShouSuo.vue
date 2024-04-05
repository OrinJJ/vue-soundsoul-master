<template>
  <div id="shousuo" class="shousuo">
    <!--退出按钮-->
    <div class="button" @click="returnZhuYe">
      <span>返回</span>
    </div>
    <div class="guanjian">
      搜索关键字：{{ $route.query.q }}
      <span>（共找到{{ count }}个结果）</span>
    </div>
    <el-tabs v-model="activeName" class="daohang">
      <el-tab-pane label="歌曲" name="1">
        <div class="zhu">
          <table>
            <thead>
              <th style="padding-left:95px;">
                音乐标题
              </th>
              <th style="padding-left:270px;">歌手</th>
              <th style="padding-left:280px;">专辑</th>
              <th style="padding-left:280px;">时长</th>
            </thead>
            <tbody>
              <!-- v-for="(item,index) in gequ" :key="index" -->
              <tr
                v-for="(item, index) in gequ"
                :key="index"
                @click="bofang(item.id)"
              >
                <td style="padding-left:95px;">
                  {{ ++index }}.{{ item.name }}
                </td>
                <td style="padding-left:270px;">{{ item.artists[0].name }}</td>
                <td style="padding-left:280px;">{{ item.album.name }}</td>
                <td style="padding-left:280px;">{{ item.duration }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="count"
          :page-size="20"
          style="height:30px; width:900px;text-align: center;"
          @current-change="huanye"
          class="huanye"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="MV" name="1004">
        <div class="zhu3">
          <div
            v-for="(item, index) in mv"
            :key="index"
            @click="mvbofang(item.id)"
            class="videoPic"
          >
            <img :src="item.cover" alt />
            <span>{{ item.name }}</span>
            <span>{{ item.artistName }}</span>
            <i>{{ item.duration }}</i>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="count"
          :page-size="20"
          style="height:30px; width:900px;text-align: center;"
          @current-change="huanye3"
          class="huanye3"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="audio">
      <audio :src="dizhiShuoSou" controls autoplay></audio>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "shousuo",
  data() {
    return {
      /* 切换导航栏时数值改变，接口传入数据类型也不一样 */
      activeName: "1",
      gequ: [],
      gedan: [],
      mv: [],
      count: "",
      page: 1,
      page1: 1,
      page2: 1,
      guanjian: this.$route.query.q,
      dizhiShuoSou: ""
    };
  },
  created() {
    this.danqu();
    // this.bbtn();
  },
  updated() {
    if (this.activeName == 1) {
      this.danqu();
    } else if (this.activeName == 1000) {
      this.gedan1();
    } else {
      this.mv1();
    }
  },
  watch: {
    activeName() {
      if (this.activeName == 1) {
        this.danqu();
      } else if (this.activeName == 1000) {
        this.gedan1();
      } else {
        this.mv1();
      }
    }
  },
  /* beforeUpdate() {
    zaisou = this.$route.query.q;
  }, // 状态更新之前执行此函数， 此时 data 中的状态值是最新的，但是界面上显示的 数据还是旧的，因为此时还没有开始重新渲染DOM节点
  updated() {
    
    // 实例更新完毕之后调用此函数，此时 data 中的状态值 和 界面上显示的数据，都已经完成了更新，界面已经被重新渲染好了！
       zaisou = this.$route.query.q;
  }, */
  methods: {
    bofang(id) {
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id: id
        }
      }).then(res => {
        let url = res.data.data[0].url;
        // this.$parent.dizhi = url;
        console.log("播放的url:", url);
        //组件传值
        // eventBus.$emit("dizhiShuoSou", url);
        eventBus.$emit("dizhi", url);
      });
    },
    danqu() {
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          keywords: this.$route.query.q,
          type: 1,
          // 获取的数据量
          limit: 20,
          offset: (this.page - 1) * 20
        }
      }).then(res => {
        this.gequ = res.data.result.songs;
        // 保存总数
        this.count = res.data.result.songCount;

        /* 毫秒转化为分秒 */
        for (let i = 0; i < this.gequ.length; i++) {
          let duration = this.gequ[i].duration;
          let min = parseInt(duration / 1000 / 60);
          if (min < 10) {
            min = "0" + min;
          }
          let miao = parseInt((duration / 1000) % 60);
          if (miao < 10) {
            miao = "0" + miao;
          }
          this.gequ[i].duration = `${min}:${miao}`;
        }
      });
    },
    mv1() {
      axios({
        url: "https://autumnfish.cn/search",
        method: "get",
        params: {
          keywords: this.$route.query.q,
          type: this.activeName,
          // 获取的数据量
          limit: 20,
          offset: (this.page2 - 1) * 20
        }
      }).then(res => {
        this.mv = res.data.result.mvs;
        // 总数
        this.count = res.data.result.mvCount;
        // 处理数据
        for (let i = 0; i < this.mv.length; i++) {
          // 时间
          let min = parseInt(this.mv[i].duration / 1000 / 60);
          let sec = parseInt((this.mv[i].duration / 1000) % 60);
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          this.mv[i].duration = min + ":" + sec;
        }
      });
    },
    huanye(val) {
      this.page = val;
      this.danqu();
    },
    huanye3(val) {
      this.page2 = val;
      this.mv1();
    },
    // gedanbofang(id) {
    //   this.$router.push(`/GeDan?q=${id}`);
    // },
    mvbofang(id) {
      this.$router.push(`/MVBF?q=${id}`);
    },
    returnZhuYe() {
      this.$router.push("/");
    },
    // bbtn() {
    //   eventBus.$on("dizhiShuoSou", message => {
    //     //这里最好用箭头函数，不然this指向有问题
    //     this.dizhiShuoSou = message;
    //     console.log("音乐传值=>音乐播放组件", this.dizhiShuoSou);
    //   });
    // }
  }
};
</script>

<style scoped>
.shousuo {
  float: left;
  position: relative;
  width: 1600px;
  height: 785px;
  overflow: hidden;
  background-color: azure; /*天蓝色*/
}
.guanjian {
  padding-right: 6px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  font-weight: bold;
  text-align: right;
}
.guanjian span {
  font-size: 13px;
  color: rgb(126, 118, 118);
}

.daohang {
  position: absolute;
  left: 25px;
  top: 55px;
  width: 1600px;
  font-size: 20px;
  height: 300px;
}
.zhu {
  width: 1500px;
  height: 600px;
  overflow: auto;
}

tbody tr {
  height: 39px;
  font-size: 13px;
  margin-left: 200px;
}
tbody tr:hover {
  color: rgb(212, 16, 16);
  cursor: pointer;
}
.zhu2 {
  width: 980px;
  height: 425px;
  overflow: auto;
}
.zhu2 div {
  float: left;
  position: relative;
  margin-left: 30px;
  margin-top: 10px;
  width: 200px;
  height: 225px;
  cursor: pointer;
}
.zhu2 img {
  float: left;
  width: 200px;
  height: 200px;
}
.zhu2 span {
  display: inline-block;
  width: 200px;
  height: 25px;
  line-height: 25px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.zhu2 i {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 100%;
  line-height: 20px;
  font-size: 13px;
  color: rgb(235, 19, 19);
  background-color: rgba(41, 39, 39, 0.8);
}
.zhu2 div::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0px;
  height: 0px;
  background-position: 50% 50%;
  transition: all 0.3s;
}
.zhu2 div:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  box-shadow: 3px 3px 3px rgba(31, 30, 30, 0.9);
  background-color: rgba(92, 88, 88, 0.6);
  background-image: url("../assets/bofang.png");
  background-repeat: no-repeat;
  background-size: 15% 15%;
  background-position: 50% 50%;
}
.zhu3 {
  width: 1500px;
  height: 630px;
  overflow: auto;
}
.zhu3 div {
  float: left;
  position: relative;
  margin-left: 30px;
  margin-top: 10px;
  width: 200px;
  height: 180px;
  cursor: pointer;
  left: 65px;
}
.zhu3 img {
  float: left;
  width: 200px;
  height: 130px;
  border-radius: 8px;
}
.zhu3 span {
  display: inline-block;
  width: 200px;
  height: 25px;
  line-height: 25px;
  font-size: 15px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.zhu3 i {
  position: absolute;
  bottom: 52px;
  right: 10px;
  width: 50px;
  height: 20px;
  font-size: 13px;
  font-weight: bold;
  line-height: 20px;
  text-align: right;
  font-style: normal;
  color: rgb(95, 245, 10);
}
.zhu3 div::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0px;
  height: 0px;
  background-position: 50% 50%;
  transition: all 0.3s;
}
.zhu3 div:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 130px;
  border-radius: 8px;
  box-shadow: 3px 3px 3px rgba(31, 30, 30, 0.9);
  background-color: rgba(92, 88, 88, 0.6);
  background-image: url("../assets/bofang.png");
  background-repeat: no-repeat;
  background-size: 9% 15%;
  background-position: 50% 50%;
}

.huanye3,
.huanye {
  position: relative;
  left: 300px;
}

.videoPic {
  margin-left: 530px;
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
