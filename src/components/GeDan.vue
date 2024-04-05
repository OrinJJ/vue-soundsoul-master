<template>
  <div class="gedan" id="gedan">
    <div class="gedan1">
      <div class="top">
        <img :src="list.coverImgUrl" alt />
        <span>{{list.name}}</span>
        <span>
          <img :src="list.creator.avatarUrl" alt class="touxiang1" />
          {{list.creator.nickname}} / {{list.createTime|formatDate}} 建立。
        </span>
        <span>
          <div class="bo" @click="fangge(list.tracks[0].id)">
            <span class="icon iconfont icon-shipin3" style="display: inline; width:120px"> 开始播放</span>
          </div>
        </span>
        <span>标签: {{list.tags[0]}}/{{list.tags[1]}}/{{list.tags[2]}}</span>
      </div>
      <div class="jianjie">简介：{{list.description}}</div>
      <template>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="daohang">
          <el-tab-pane label="歌曲列表" name="first">
            <div class="zhu">
              <span style="width:400px; text-align:center">音乐标题</span>
              <span style="width:150px;">歌手</span>
              <span style="width:250px;">专辑</span>
              <span style="width:150px;">时长</span>
            </div>
            <table>
              <tbody>
                <tr v-for="(item, index) in list.tracks" :key="item.id">
                  <td style="width:400px">
                    <span>{{ index + 1 }}</span>
                    <!-- 点击播放 -->
                    <div class="touxiang" @click="fangge(item.id)">
                      <img :src="item.al.picUrl" alt="X" class="touxiang" />
                      <div>bofang</div>
                    </div>
                    <span>{{ item.name }}</span>
                  </td>
                  <td style="width:150px">{{ item.ar[0].name }}</td>
                  <td style="width:250px">
                    <span style=" float:left; width:240px ">{{ item.al.name }}</span>
                  </td>
                  <td style="width:150px">{{ item.dt }}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="评论" name="second">
            <div class="remen">热门评论({{hotCount}})</div>
            <div class="remen1" v-for="(item, index) in hotComment" :key="index">
              <img :src="item.user.avatarUrl" alt="x" />
              <span>
                <span>{{ item.user.nickname }}:</span>
                {{ item.content }}
              </span>
              <span
                v-if="item.beReplied.length != 0"
                style="background-color: rgba(163, 157, 157,.5);"
              >
                <span style="font-size: 15px;">{{ item.beReplied[0].user.nickname }}：</span>
                {{ item.beReplied[0].content }}
              </span>
              <span style="color: rgb(181, 189, 196);">{{ item.time|formatDate }}</span>
            </div>

            <div class="remen">最新评论({{total}})</div>
            <div class="remen1" v-for="(item,index) in comments" :key="index">
              <img :src="item.user.avatarUrl" alt="x" />
              <span>
                <span>{{item.user.nickname}}：</span>
                {{ item.content }}
              </span>
              <span
                v-if="item.beReplied.length!=0"
                style="background-color: rgba(163, 157, 157,.5);"
              >
                <span style="font-size: 15px;">{{ item.beReplied[0].user.nickname }}：</span>
                {{ item.beReplied[0].content }}
              </span>
              <span style="color: rgb(181, 189, 196);">{{ item.time|formatDate }}</span>
            </div>
           
            <!-- 分页器 -->
            <el-pagination
              @current-change="handleCurrentChange"
              background
              layout="prev, pager, next"
              :total="total"
              :current-page="page"
              style="float:left;margin-top:10px;width:950px;text-align:center;"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {formatDate} from '../../public/filters'
export default {
  name: "gedan",
  data() {
    return {
      activeName: "first",
      list: {},
      // 热门评论
      hotComment: [],
      // 热门评论的个数
      hotCount: 0,
      // 普通评论
      comments: [],
      // 总条数
      total: 0,
      // 页码
      page: 1
      
    };
  },
  /* 过滤器，能让秒转换为年月日 */
  filters:{
    formatDate(time){
        var data = new Date(time);
        return formatDate(data,'yyyy-MM-dd');
    }
   },
  created() {
    axios({
      url: "https://autumnfish.cn/playlist/detail",
      method: "get",
      params: {
        id: this.$route.query.q
      }
    }).then(res => {
      this.list = res.data.playlist;

      /* 毫秒转化为分秒 */
      for (let i = 0; i < this.list.tracks.length; i++) {
        let dt = this.list.tracks[i].dt;
        let min = parseInt(dt / 1000 / 60);
        if (min < 10) {
          min = "0" + min;
        }
        let miao = parseInt((dt / 1000) % 60);
        if (miao < 10) {
          miao = "0" + miao;
        }
        this.list.tracks[i].dt = `${min}:${miao}`;
      }

    });

    axios({
      url: "https://autumnfish.cn/comment/hot",
      method: "get",
      params: {
        id: this.$route.query.q,
        // 传递类型
        type: 2
      }
    }).then(res => {
      // console.log(res)
      this.hotComment = res.data.hotComments;
      // 保存个数
      this.hotCount = res.data.total;
    });
    // 获取 最新评论
    axios({
      url: "https://autumnfish.cn/comment/playlist",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: 0
      }
    }).then(res => {
      // console.log(res)
      // 总个数
      this.total = res.data.total;
      // 评论数据
      this.comments = res.data.comments;
    });
  },
  methods: {
    fangge(id) {
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id: id
        }
      }).then(res => {
        let url = res.data.data[0].url;
        this.$parent.dizhi = url;
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 保存页码
      this.page = val;
      // 重新获取数据
      axios({
        url: "https://autumnfish.cn/comment/playlist",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 10,
          // 根据页码计算
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        // console.log(res)
        // 总个数
        this.total = res.data.total;
        // 评论数据
        this.comments = res.data.comments;
      });
    }
  }
};
</script>

<style scoped>
.gedan {
  float: left;
  position: relative;
  width: 1000px;
  height: 550px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
}
.gedan1 {
  float: left;
  width: 1020px;
  height: 550px;
  overflow: auto;
}
.top {
  margin: 20px 25px;
  width: 950px;
  height: 160px;
}
.top > img {
  float: left;
  height: 160px;
  width: 140px;
  border-radius: 5px;
}
.top span {
  display: block;
  margin-left: 10px;
  float: left;
  height: 40px;
  line-height: 40px;
}
.top span:first-of-type {
  width: 800px;
  font-size: 22px;
}
.top span:nth-of-type(2) {
  width: 800px;
  font-size: 15px;
}
.touxiang1 {
  margin-right: 10px;
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.top span:nth-of-type(3) {
  width: 125px;
  font-size: 16px;
}
.bo {
  margin-top: 8px;
  width: 118px;
  height: 30px;
  background-color: rgb(192, 10, 10);
  border-radius: 10px;
  cursor: pointer;
}
.bo:hover {
  opacity: 0.8;
  box-shadow: 2px 1px 5px rgb(138, 39, 39);
}
.bo span {
  color: rgb(255, 255, 255);
  line-height: 30px;
}
.top span:last-of-type {
  width: 800px;
  font-size: 18px;
}
.jianjie {
  margin-top: -15px;
  margin-left: 25px;
  width: 950px;
  height: 40px;
  font-size: 15px;
  line-height: 20px;
  text-indent: 2em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.daohang {
  margin: 12px 25px;
  width: 950px;
  background-color: rgba(255, 255, 255, 0.5);
}
.zhu {
  width: 1000px;
  height: 50px;
  background-color: rgba(214, 225, 226, 0.6);
}
.zhu > span {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 700;
  color: rgb(94, 89, 89);
}
table {
  width: 950px;
}

tr {
  height: 100px;
  line-height: 90px;
  font-family: "fangsong";
  font-weight: bold;
  font-size: 15px;
  vertical-align: center;
  cursor: pointer;
}
td span:first-of-type {
  float: left;
  width: 30px;
}
td span:last-of-type {
  float: left;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.touxiang {
  float: left;
  position: relative;
  margin-right: 45px;
  width: 90px;
  height: 90px;
  border-radius: 5px;
}
.touxiang img {
  width: 100%;
  height: 100%;
}
tr:hover {
  color: rgb(255, 30, 0);
}
.touxiang::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  height: 0px;
  width: 0px;
  background-position: 50% 50%;
  transition: all 0.3s;
}
.touxiang:hover:after {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  height: 90px;
  width: 90px;
  border-radius: 5px;
  background-color: rgba(32, 31, 31, 0.8);
  background-image: url("../assets/bofang.png");
  background-repeat: no-repeat;
  background-size: 30% 33%;
  background-position: 50% 50%;
}
.remen {
  margin-top: 2px;
  margin-bottom: 5px;
  float: left;
  width: 950px;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
  text-indent: 1em;
  color: rgb(235, 18, 18);
  font-family: "fangsong";
  font-weight: bold;
}
.remen1 {
  float: left;
  position: relative;
  margin-top: 15px;
  width: 950px;
  font-family: "fangsong";
}
.remen1 > span {
  display: block;
  float: right;
  width: 890px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.remen1 img {
  float: left;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.remen1 > span > span {
  color: rgb(6, 109, 243);
}
.remen1 span:nth-of-type(1) {
  height: 30px;
  line-height: 30px;
  font-size: 18px;
}
.remen1 span:nth-of-type(2) {
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  text-indent: 1em;
  border-radius: 5px;
}
.remen1 span:nth-of-type(3) {
  height: 20px;
  line-height: 20px;
  font-size: 13px;
}
.remen1::before {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 50px;
  width: 900px;
  height: 2px;
  background-color: rgb(221, 206, 206);
}
</style>