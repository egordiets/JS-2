export default Vue.component('basket-goods', {
    data() {
        return {
            basketGoodsItems: []
        }
    },

    template: `
        <div class="fixed-area">
           <div class="basket-cart">
              <div class="basket-cart_header">
                 <h1 class="basket-cart_header_title">Корзина</h1>
                 <div class="basket-cart_header_icon"
                    v-on:click="$emit('closeclick')"
                 ></div>
              </div>
              <div class="basket-cart_content">
                <basket-item 
                v-for="item in basketGoodsItems" 
                :item="item"
                @add="addGood"
                @delete="deleteGood"
                ></basket-item>
              </div>
           </div>
        </div>
    `,
    mounted() {
        service(GET_BASKET_GOODS_ITEMS).then((basketGoods) => {
            this.basketGoodsItems = basketGoods
        })
    },
    methods: {
        addGood(id) {
            serviceWithBody(GET_BASKET_GOODS_ITEMS, "POST", {
                id
            }).then((data) => {
                this.basketGoodsItems = data
            })
        },
        deleteGood(id) {
            serviceWithBody(GET_BASKET_GOODS_ITEMS, "DELETE", {
                id
            }).then((data) => {
                this.basketGoodsItems = data
            })
        }
    }
})