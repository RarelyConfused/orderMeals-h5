<template>
  <div id="app" @touchmove.prevent>
    <v-header :seller="seller"></v-header>
    <div class="tab-wrapper">
      <tab ref="tab" :tabs="tabs"></tab>
    </div>
  </div>
</template>

<script>
  import qs from 'query-string'
  import { getSeller } from 'api'
  import VHeader from 'components/v-header/v-header'
  import Goods from 'components/goods/goods'
  import Tab from 'components/tab/tab'
import { createOrders, getDesk, hasCurrentOrders } from './api'
import { socketClient } from './socket'

  const queryParams = qs.parse(location.search)
  export default {
    data() {
      return {
        seller: {
          id: queryParams.id
        },
        did: queryParams.did,
        desk: {
          name: ''
        }
      }
    },
    computed: {
      tabs() {
        return [
          {
            label: '当前桌号：' + this.desk.name,
            component: Goods,
            data: {
              seller: this.seller
            }
          }
        ]
      },
      arr() {
        const arr = []
        for (var i = 1; i <= this.desk.num; i++) {
          const obj = {}
          obj.content = i.toString()
          arr.push(obj)
        }
        return arr
      }
    },
    created() {
      this._getSeller()
      this.getDesk()
      this.initSocket()
    },
    methods: {
      initSocket() {
        socketClient.init(this.did)
      },
      showAlert(msg) {
      this.$createDialog({
        type: 'alert',
        title: '提示',
        content: msg,
        icon: 'cubeic-alert',
        $events: {
          confirm: () => {
            this.showAlert(msg)
          }
        }
      }).show()
    },
      _getSeller() {
        getSeller({
          id: this.seller.id
        }).then((seller) => {
          this.seller = Object.assign({}, this.seller, seller)
        }).catch((e) => {
          this.showAlert(e)
        })
      },
      getDesk() {
        getDesk({
          did: this.did
        }).then((res) => {
          this.desk = res
          this.hasCurrOrders()
        }).catch((e) => {
          this.showAlert(e)
        })
      },
      hasCurrOrders() {
        hasCurrentOrders({did: this.did}).then((res) => {
          if (res == null) {
          this.showPickerStyle()
          } else {
            this.$refs.tab.onChange(res)
            sessionStorage.setItem('oid', res.oid)
          }
        })
      },
      showPickerStyle() { // 人数选择
      this.$createActionSheet({
        title: '请选择就餐人数',
        maskClosable: false,
        cancelTxt: '-',
        pickerStyle: true,
        data: this.arr,
        $events: {
          select: (item, index) => {
            createOrders({
              aid: this.seller.id,
              deskId: this.desk.id,
              userNum: item.content,
              type: 1
            }).then((res) => {
              sessionStorage.setItem('oid', res)
              this.$refs.tab.onChange(res)
            })
          console.log(item, index)
          },
          cancel: () => {
            console.log(123)
          }
        }
      }).show()
    }
    },
    components: {
      Tab,
      VHeader
    }
  }
</script>

<style lang="stylus" scoped>
  #app
    .tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0
</style>
