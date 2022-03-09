import '@babel/polyfill';
// import {getTest} from 'Scripts/services/testApi.js'
// import helloWorld from 'Scripts/components/HelloWorld.vue'
// import {resolve} from 'path';
import {resolveHost, resolveAllHosts} from 'Scripts/services/HostResolver.js'
import {getAllFixedHost} from 'Scripts/services/FixedHost.js'
import {opTurnCamel} from 'Scripts/services/opTurn.js'
import {mapPos} from 'Scripts/services/mapPos.js'
import {getLoginStatus} from 'Scripts/services/Login.js'
import {getEventInfo, lotteryExecute} from 'Scripts/services/Event1111.js'
import {getCouponSeller} from 'Scripts/services/GetCouponSeller.js'
import {getActivityGoods} from 'Scripts/services/GetActivityGoods.js'
import {getItemDetails} from 'Scripts/services/Items.js'

window.hostList = getAllFixedHost()

function getToday() {
  let today = new Date()
  let month = today.getMonth() + 1
  let day = today.getDate()
  return Number(today.getFullYear() + ((month > 9 ? '' : '0') + month) + ((day > 9 ? '' : '0') + day))
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function degConvertToRadians(deg = 0) {
  return deg * Math.PI/180
}

function getDiceNumberRotate(num) {
  let rotate = {
    rx: 0,
    ry: 0,
    rz: 0,
  }
  switch (num) {
    case 1:
      break
    case 2:
      rotate.rz = 180
      break
    case 3:
      rotate.rz = 270
      break
    case 4:
      rotate.rz = 90
      break
    case 5:
      rotate.rx = 270
      break
    case 6:
      rotate.rx = 90
      break
  }

  return rotate
}

const priceFormatClear = price => String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const priceFormat = (price, symbol = '$') => symbol + priceFormatClear(price)
const LOGIN_REF = `${getAllFixedHost().member}/user/login.htm?refer=${ window.location.href }`
const COMMON_ERR_MSG = '系統忙碌中，請重新整理後在試！'

var dicePosition = {
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 90,
}//共用一組dicePosition 運用Offset 計算不同位置

var diceOffset = [
  {
    x: -1,
    y: 1,
  },{
    x: -0.6,
    y: 0.6,
  },{
    x: -0.4,
    y: 1.4,
  },{
    x: 0.4,
    y: 0.8,
  },{
    x: 1.1,
    y: 1,
  },
]

window.tlJumpFaceRight = new TimelineMax({
  autoPlay: false
})
window.tlJumpFaceLeft = new TimelineMax({
  autoPlay: false
})

var app = new Vue({
  el: '#app',
  data() {
    return {
      today: getToday(),
      userAgent: window.navigator.userAgent || window.navigator.vendor || window.opera,
      ctrlId: '',
      noLogin: true,
      unStart: true,
      userNick: '',
      userCoin: 0,
      userTicket: 0,
      isRunnable: false, //api info 執行次數是否可遊戲 一天最高11次
      stageStart: true, // 場景最初階段
      stageRoll: false, // 場景骰子階段
      stageGame: false, // 場景遊戲階段
      showRollBanner: true,
      showRollResult: false,
      showPlayer: false,
      showStartRu: true,
      openPopup: false,
      rolled: false, //flag 控制骰出沒
      roller: {
        camera: null,
        scene: null,
        render: null,
        meshs: [],
        show: false,
      },
      diceResult: [1,1,1,1,1],
      requesAnimationtId: null,
      stepsNumber: 0,
      totalSteps: 0,
      currentGrid: 0,
      isSkip: false,
      playerWalking: false,
      timerRoller: null,
      couponSeller: [],
      coinSuitableGoods: [],
      rewardInfo: {}, //得獎資訊
      couponIsRuten: false,
      couponIsSeller: false,
      couponIs711: false,
      couponIsCVS: false,
      rewardIs711: false,
      rewardIsCVS: false,
      g: '',
      disabledStart: false,
      lotteryErrMsg: '',
      lotteryErr: false,
      eld: '',
      gameTimeEnd: false
    }
  },
  watch: {
    openPopup(newValue) {
      if(newValue) {
        document.body.classList.add('body-lock')
      } else {
        document.body.classList.remove('body-lock')
      }
    }
  },
  computed: {
    isMobile() {
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|Ruten/i.test(this.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(this.userAgent.substr(0,4))) return true
      else return false
    },
    haveCouponSeller() {
      return this.couponSeller.length ? true : false
    },
    ticketlessButCoin() {
      return this.userTicket < 1 && this.userCoin > 111
    },
    ticketLessAndNoCoin() {
      return this.userTicket < 1 && this.userCoin < 111
    },
    coinActive() {
      if(this.today === 20191108 ) {
        return new Date().getHours() >= 11
      } else {
        return this.today > 20191108
      }
    },
    rewardIsCoin() {
      return this.rewardInfo.prize === 'X'
    },
    rewardIsCoupon() {
      return this.rewardInfo.prize === 'B'
    },
    rewardNotCoinORCoupon() {
      return !(this.rewardInfo.prize === 'B' || this.rewardInfo.prize === 'X')
    }
  },
  created() {
    const TIME_END = 20461114
    if(this.today === TIME_END ) {
      if(new Date().getHours() >= 11) {
        this.gameTimeEnd = true
      } else {
        this.gameTimeEnd = false
      }
    } else if(this.today > TIME_END ){
      this.gameTimeEnd = true
    } else {
      this.gameTimeEnd = false
    }
  },
  mounted() {
    let vm = this

    if(this.gameTimeEnd) {
      this.openPopup = true
    } else {

      vm.noLogin = false
      vm.ctrlId = 'ctrlRowId'
      vm.userNick = 'user'
      vm.userCoin = 100
      vm.userTicket = 3
      vm.isRunnable = true

      particlesJS.load('particles-js', 'assets/particles.json')// have callback function
      /* particlesJS.load(@dom-id, @path-json, @callback (optional)) */

      vm.$nextTick(()=>{
        vm.initRoller()
      })
    }
  },
  methods: {
    start() {
      let vm = this
      if(this.gameTimeEnd) {
        this.openPopup = true
        return
      }

      // TODO 判斷 次數 彩票 可執行
      if(vm.noLogin) {
        window.location.href = LOGIN_REF
        return
      }

      // vm.isRunnable = true
      // vm.userCoin = 120

      if(!vm.isRunnable) {
        vm.openPopup = true // 次數已滿
      } else if(vm.ticketlessButCoin) {
        vm.openPopup = true
      } else if(vm.ticketLessAndNoCoin) {
        vm.openPopup = true
      } else {
        this.requestLottery()
      }

    },
    startUseCoin() {
      this.openPopup = false
      this.userCoin = this.userCoin - 111
      this.requestLottery()
    },
    requestLottery() {
      let vm = this
      if(this.disabledStart) return
      this.disabledStart =  true

      function mapDice(type) {
        let result = {
          steps: 0,
          dice: []
        }
        let map = []
        switch (type) {
          case 'X':  // X 彩票              17、5、9、13
            map = [
              [2,3,4,4,3],
              [1,1,1,1,1],
              [1,2,1,2,3],
              [6,2,1,3,1]
            ]
            result.dice = map[getRandomInt(0,3)]
          　break;
          case 'B': // B 折扣碼            18、6、10、14
            map = [
              [6,4,4,2,2],
              [1,1,1,1,2],
              [2,2,1,3,2],
              [3,3,3,1,4]
            ]
            result.dice = map[getRandomInt(0,3)]
          　break;
          case 'C': // C 711               20、12
            map = [
              [5,4,4,6,1],
              [1,1,1,1,2],
            ]
            result.dice = map[getRandomInt(0,1)]
          　break;
          case 'D': // D CVS               8、16
            map = [
              [1,2,2,2,1],//8
              [2,3,2,3,6],//16
            ]
            result.dice = map[getRandomInt(0,1)]
          　break;
          case 'E': // E 實體贈品(露天)     19
            map = [
              [5,4,1,4,5],//19
            ]
            result.dice = map[0]
          　break;
          case 'F': // F 實體贈品(Seller)   11
            map = [
              [1,1,6,2,1],//19
            ]
            result.dice = map[0]
          　break;
          case 'G': // G 虛擬贈品           7、15
            map = [
              [1,1,1,1,3], //7
              [4,2,2,3,4], //15
            ]
            result.dice = map[getRandomInt(0,1)]
          　break;
        }

        result.steps = result.dice.reduce((acc, item)=>{
          acc = acc + item
          return acc
        },0)

        result.dice = _.shuffle(result.dice);

        return result
      }

      let fooX = {prize: 'X', coin: 300, 'coupon_start_time': 'xxxx','coupon_end_time': 'xxxx'}
      let fooB1 = {prize: 'B', award: 'B1', name: 'B-通靈獎', coupon_code: 'F23570D8' , coupon_deadeline: null}
      let fooB9 = {prize: 'B', award: 'B9', name: 'B-通靈獎', coupon_code: 'F23570D8' , coupon_deadeline: null}
      let fooB14 = {prize: 'B', award: 'B14', name: '711', coupon_code: 'F23570D8' , coupon_deadeline: null}
      let fooB15 = {prize: 'B', award: 'B15', name: 'CVS', coupon_code: 'F23570D8' , coupon_deadeline: null}
      let fooC = {prize: 'C', award: 'C2', name: 'C2-通靈獎', coupon_code: null}
      let fooD = {prize: 'D', award: 'D2', name: 'D2-通靈獎', coupon_code: null}
      let fooE = {prize: 'E', award: 'E2', name: 'E2-通靈獎', coupon_code: null}

      function lotteryExecuteDemo() {
        return new Promise((resolve, reject)=>{
          resolve( opTurnCamel(fooC))
        })
      }
      // new Promise((resolve, reject)=>{
      //   resolve( opTurnCamel(fooE))
      // })

      lotteryExecuteDemo().then((res)=>{
        // let _res = opTurnCamel(res.reward)
        let _res = res
        let diceRes = mapDice("B") // _res.prize

        switch (_res.prize){
          case 'B':
            let _num = _res.award.slice(1)
            // b1~b8賣家  b9~13露天 14 711 15 cvs
            if(_num <=  8 && _num > 0) {
              this.couponIsSeller = true
              this.eid = _res.eid
            }
            if(_num <= 13 && _num > 8) this.couponIsRuten = true
            if(_num == 14) this.couponIs711 = true
            if(_num == 15) this.couponIsCVS = true
            break;
          case 'C':
            this.rewardIs711 = true
            _res.img = `assets/awards/C.jpg`
            break;
          case 'D':
            _res.img = `assets/awards/${_res.award}.jpg`
            this.rewardIsCVS = true
            break;
          case 'E':
            _res.img = `assets/awards/${_res.award}.jpg`
            break;
          case 'F':
            _res.img = `assets/awards/${_res.award}.jpg`
            break;
        }

        this.rewardInfo = Object.assign({}, this.rewardInfo, _res)

        this.diceResult = diceRes.dice // [1,2,3,4,5]
        this.totalSteps = diceRes.steps
        this.stepsNumber = diceRes.steps
        this.startToRoll()

        // this.openPopup = true
        // this.unStart = false
      })
      // .catch((err)=>{
      //   vm.openPopup = true
      //   vm.lotteryErrMsg = err
      //   vm.lotteryErr= true
      //   this.disabledStart =  false
      // })
    },
    startToRoll() {
      //開始到骰子的轉場
      let vm = this
      var tl = new TimelineMax({
        onStart: function() {
          document.body.classList.add('lock-screen')
        },
        onComplete: function() {
          document.body.classList.remove('lock-screen')
          vm.$refs.startTower.removeAttribute('style')
          vm.$refs.startContent.removeAttribute('style')
          vm.stageStart = false
          vm.stageRoll = true

          vm.runRoller()
          vm.initRollerTimer()
          if(vm.isMobile) vm.initDetectOrientation()
        },
      })

      tl.to(vm.$refs.startTower, 0.5,{
        y:-1000,
        ease: Back.easeInOut.config(1.7)})
      .to(vm.$refs.startContent, 0.5,{
        alpha:0
      },0)

      vm.unStart = false
    },
    initRoller() {
      let vm = this
        // window.innerWidth / window.innerHeight
        vm.roller.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 )
        vm.roller.camera.position.z = 400
        vm.roller.scene = new THREE.Scene()
        vm.roller.render = new THREE.WebGLRenderer( { antialias: true ,alpha: true} )

        var textures = []
        var materials = []
        var geometry = new THREE.BoxBufferGeometry( 50, 50, 50 )

        for(let i = 0; i < 6 ; i++) {
          textures.push(new THREE.TextureLoader().load( `./assets/dice-${i+1}@3x.png` ))
          textures[i].minFilter = THREE.NearestFilter
          textures[i].magFilter = THREE.LinearFilter
          materials.push(new THREE.MeshBasicMaterial( { map: textures[i] } ))
        }

        for(let i = 0; i < 5 ; i++) {
          vm.roller.meshs.push(new THREE.Mesh( geometry, materials ))
          vm.roller.scene.add(vm.roller.meshs[i])
        }

        vm.roller.render.setPixelRatio( window.devicePixelRatio )
        vm.roller.render.setSize( window.innerWidth, window.innerHeight )
        document.getElementById('dice-wrap').appendChild( vm.roller.render.domElement )
    },
    initRollerTimer() {
      let vm = this
      vm.timerRoller = setTimeout(()=>{
        vm.rollDice()
      },6000)
    },
    clearTimerRoller() {
      clearTimeout(this.timerRoller)
    },
    initDetectOrientation() {
      let vm = this
      if (window.DeviceOrientationEvent) {
        window.addEventListener('devicemotion', function(event) {
          let x = event.acceleration.x,
            y = event.acceleration.y
            z = event.acceleration.z;

          tx.innerHTML = Math.round(x);
          ty.innerHTML = Math.round(y);
          tz.innerHTML = Math.round(z);
        }, false);

        // Shake sensitivity (a lower number is more)
        var sensitivity = 20;

        // Position variables
        var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;

        // Listen to motion events and update the position
        window.addEventListener('devicemotion', handler, false);

        function handler(e) {
          x1 = e.accelerationIncludingGravity.x;
          y1 = e.accelerationIncludingGravity.y;
          z1 = e.accelerationIncludingGravity.z;
        }

        // Periodically check the position and fire
        // if the change is greater than the sensitivity
        setInterval(function () {
          var change = Math.abs(x1-x2+y1-y2+z1-z2);

          if (change > sensitivity) {
            vm.rollDice()
            window.removeEListener('devicemotion', handler, false)
          }

          // Update new position
          x2 = x1;
          y2 = y1;
          z2 = z1;
        }, 150);
      } else {
        alert('裝置瀏覽器未偵測到支援搖動功能，請點擊或等待數秒後骰出骰子')
      }
    },
    runRoller() {
      let vm = this

      if(!vm.roller.scene) {
        cancelAnimationFrame(vm.requesAnimationtId)
        return
      } else {
        vm.requesAnimationtId = requestAnimationFrame(vm.runRoller)

        vm.roller.meshs.forEach((mesh, index)=>{
          mesh.position.set(dicePosition.x * diceOffset[index].x, dicePosition.y * diceOffset[index].y, 0 )
          mesh.rotation.x = degConvertToRadians(dicePosition.rotateX + getDiceNumberRotate(vm.diceResult[index]).rx)
          mesh.rotation.y = degConvertToRadians(dicePosition.rotateY + getDiceNumberRotate(vm.diceResult[index]).ry)
          mesh.rotation.z = degConvertToRadians(dicePosition.rotateZ + getDiceNumberRotate(vm.diceResult[index]).rz)
        })

        if(vm.roller.show) {
          vm.roller.render.render(vm.roller.scene, vm.roller.camera)
        }
      }
    },
    rollDice() {
      var vm = this
      if(vm.rolled) return
      vm.clearTimerRoller()
      vm.showRollBanner = false
      vm.roller.show = true

      // vm.diceResult = vm.diceResult.map((item)=>{
      //   return getRandomInt(1, 6)
      // })

      // vm.stepsNumber = vm.diceResult.reduce((acc, item)=>{
      //   acc = acc + item
      //   return acc
      // }, 0)

      // vm.totalSteps = vm.stepsNumber

      setTimeout(()=>{
        TweenMax.to(dicePosition, 0.6,{
          x: 200,
          y: -200,
          rotateX: 360,
          rotateY: 360,
          ease: Power1.easeOut,
          onStart: function() {
            vm.showRollResult = true
          },
          onComplete: function(){
            // dicePosition.x = 10000
            // vm.roller.show = false
            setTimeout(()=>{vm.rollToGame()},1000)
          }
        })
      }, 300)

      vm.rolled = true
    }, //骰骰子
    rollToGame() {
      let vm = this
      let diceWrap = document.getElementById('dice-wrap')

      while (diceWrap.firstChild) {
        diceWrap.removeChild(diceWrap.firstChild)
      }

      vm.stageRoll = false
      vm.stageGame = true

      vm.$nextTick(()=>{
        vm.initPlayerJump()
        let domPu = vm.$refs.ruStart.getElementsByClassName('pu-wrap')[0]
        let tlRuEnter = new TimelineMax({
          onStart: ()=>{
            vm.$refs.stageGame.getElementsByClassName('game-icon-start')[0].remove()
          },
          onComplete: ()=>{
            vm.showStartRu = false
            vm.showPlayer = true
            vm.playerWalking = true
            vm.movePlayer()
          },
          delay: 1
        })

        tlRuEnter.from(vm.$refs.ruStart,0.5,{
          x: -100,
          y: -500,
          ease: Power3.easeOut,
        })
        .set(domPu,{alpha: 1},0.25)
        .to(domPu,1,{alpha: 0},0.25)
      })
    },
    initPlayerJump() {
      let vm = this
      tlJumpFaceLeft.add('a')
        .set(vm.$refs.player,{backgroundPosition: '0px -139px'},'a')
        .set(vm.$refs.player,{backgroundPosition: '-96px -139px'},'a+=0.1')
        .set(vm.$refs.player,{backgroundPosition: `-192px -139px`},'a+=0.2')
        .set(vm.$refs.player,{backgroundPosition: `-288px -139px`},'a+=0.3')

      tlJumpFaceRight.add('a')
        .set(vm.$refs.player,{backgroundPosition: '0px 0px'},'a')
        .set(vm.$refs.player,{backgroundPosition: '-96px 0px'},'a+=0.1')
        .set(vm.$refs.player,{backgroundPosition: `-192px 0px`},'a+=0.2')
        .set(vm.$refs.player,{backgroundPosition: `-288px 0px`},'a+=0.3')
    },
    movePlayer() {
      let vm = this
      let gameOver = vm.stepsNumber <= 0
      let isFaceRight = vm.currentGrid > 3 && vm.currentGrid < 12 ? true : false

      if(gameOver) {
        let domYa = vm.$refs.player.getElementsByClassName('game-player-ya')[0]
        vm.playerWalking = false

        if(isFaceRight) {
          TweenMax.set(vm.$refs.player,{backgroundPosition: `-192px -139px`},'a+=0.2')
          domYa.classList.add('is-right')
        } else {
          TweenMax.set(vm.$refs.player,{backgroundPosition: `-192px 0px`},'a+=0.2')
          domYa.classList.add('is-left')
        }

        setTimeout(()=>{
          vm.showGameResult()
        }, 500)
      } else {
        if(vm.isSkip) {
          vm.stepsNumber = 0
          vm.playerMoveTo(true)
        } else {
          vm.stepsNumber = vm.stepsNumber - 1
          vm.playerMoveTo()
        }
      }
    },
    playerMoveTo(end) {
      let vm = this
      let grids = 16
      let endIndex = vm.totalSteps % grids
      let nextIndex = vm.currentGrid + 1 < grids ? vm.currentGrid + 1: 0
      let nextGird = end ? endIndex : nextIndex
      let isFaceLeft = vm.currentGrid > 3 && vm.currentGrid < 12 ? true : false

      TweenMax.to(vm.$refs.playerWrap,0.4,{
        x: mapPos[nextGird].x,
        y: mapPos[nextGird].y,
        ease: Power0.easeNone,
        onComplete: ()=> {
          setTimeout(()=>{
            vm.currentGrid = nextGird
            vm.movePlayer()
          },100)
        }
      })

      if(isFaceLeft) {
        tlJumpFaceLeft.play(0)
      } else {
        tlJumpFaceRight.play(0)
      }
    },
    showGameResult() {
      if(this.couponIsSeller) this.fetchCouponSeller()
      if(this.rewardIsCoin  && this.coinActive) this.fetchActivityGoods()

      this.openPopup = true

      particlesJS.load('particles-ribbon', 'assets/particles-ribbon.json')
      setTimeout(()=>{
        pJSDom[1].pJS.fn.vendors.destroypJS()
        pJSDom = []
      },2000)
    },
    fetchCouponSeller() {
      const PAGES = 10
      const STORE_HOST_PC = 'https://class.ruten.com.tw/user/index00.php?s='
      const STORE_HOST_M = 'https://m.ruten.com.tw/store/?seller='
      let vm = this
      let storeHost = this.isMobile ? STORE_HOST_M : STORE_HOST_PC

      // let foo = [
      //   {user_nick: 'sofa528', store_name: 'sofa528的賣場', user_img: ''},
      //   {user_nick: 'sagagibox', store_name: '東憶批發購物網', user_img: ''},
      //   {user_nick: 'letshego', store_name: 'letshego的賣場', user_img: 'https://img.ruten.com.tw/credit_photo/l/e/letshego_1.jpg'}
      // ]

      // vm.couponSeller = opTurnCamel(foo).map((item)=>{
      //   item['storeLink'] = storeHost + item.userNick
      //   return item
      // })

      getCouponSeller(vm.eid, PAGES)
        .then((res)=>{
          vm.couponSeller = opTurnCamel(res.data).map((item)=>{
            item['storeLink'] = storeHost + item.userNick
            return item
          })
        })
        .catch((err)=>{
          console.log('err', err)
        })
    },
    fetchActivityGoods() {
      let vm = this
      getActivityGoods(this.ctrlId).then((res)=>{
        getItemDetails(res).then((res)=>{
          res.data.forEach((item)=>{
            item.link = `${getAllFixedHost().goods}/item/show?${item.id}`
            vm.coinSuitableGoods.push(item)
          })
        })
      })
    },
    reStart() {
      location.reload()
    }
  }
})

// const PROD_HOST = `https://member.ruten.com.tw`
// const STAGE_HOST = `https://member.stage.ruten.com.tw`
// const DEV_HOST = `https://kanghu1016.member.dev2.ruten.com.tw`
// console.log(getAllFixedHost())
// const memberHost = resolveHost('member') === 'https://prestage.member.dev2.ruten.com.tw' ? 'https://kanghu1016.rapi.dev5.ruten.com.tw' : resolveHost('member')
// const LOGIN_REF = `${memberHost}/user/login.htm?refer=${ window.location.href }`


