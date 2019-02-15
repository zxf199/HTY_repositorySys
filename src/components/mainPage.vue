<template>
  <div>
    <div class="local">
      <img src="../assets/shenzhen.jpg" alt="" class="intro-bg">
      <div class="current-position">
        <i class="iconfont icon-dingwei">{{currentPosition}}</i>
      </div>
    </div>
  </div>
</template>
<script>
import AMap from 'AMap'
export default {
  name: 'mainPage',
  data () {
    return {
      currentPosition: ''
    }
  },
  mounted () {
    // 加载天气查询插件
    this.getPosition().then((res) => {
      this.getWeather()
    })
  },
  methods: {
    async getPosition () {
      let that = this
      await new Promise(function (resolve, reject) {
        AMap.plugin('AMap.CitySearch', function () {
          var citySearch = new AMap.CitySearch()
          citySearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // 查询成功，result即为当前所在城市信息
              that.currentPosition = result.city
              resolve()
            }
          })
        })
      })
    },
    getWeather () {
      let that = this
      AMap.plugin('AMap.Weather', function () {
        // 创建天气查询实例
        var weather = new AMap.Weather()
        // 执行实时天气信息查询
        weather.getLive(that.currentPosition, function (err, data) {
          console.log(err, data)
        })
      })
    }
  }
}
</script>
<style scoped>
.local {
  position: relative;
}
.intro-bg {
  width: 100%;
  height: 250px;
}
.current-position {
  position: absolute;
  top: 100px;
  left:150px;
}
</style>
