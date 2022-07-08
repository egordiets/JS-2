const BASE_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';
const GET_GOODS_ITEMS = `${BASE_URL}catalogData.json`;
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}getBasket.json`;

function service(url) {
    return fetch(url)
        .then((res) => res.json())
}

function init() {
    Vue.component('custom-search', {
        template: `
          <input type="text" class="goods-search" @input="$emit('input', $event.target.value)"/>
        `
    })

    const CustomButton = Vue.component('custom-button', {
        template: `
          <button class="search-button" type="button" v-on:click="$emit('click')">
             <slot></slot>
          </button>
        `
    })

    const basketGoods = Vue.component('basket-goods', {
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
                   content
                </div>
             </div>
          </div>
        `
    })

    const goodsItem = Vue.component('goods-item', {
        props: [
            'item'
        ],
        template: `
          <div class="goods-item">
             <h3>{{ item.product_name }}</h3>
             <p>{{ item.price }}</p>
          </div>
        `
    })

    const app = new Vue({
        el: '#root',
        data: {
            items: [],
            search: '',
            isVisibleCart: false
        },
        methods: {
            setVisionCart() {
                this.isVisibleCart = !this.isVisibleCart;
            },
            fetchGoods() {
                service(GET_GOODS_ITEMS).then((data) => {
                    this.items = data;
                    this.filteredItems = data;
                });
            },
        },
        computed: {
            calculatePrice() {
                return this.filteredItems.reduce((prev, { price }) => {
                    return prev + price;
                }, 0)
            },
            filteredItems() {
                return this.items.filter(({ product_name }) => {
                    return product_name.match(new RegExp(this.search, 'gui'))
                })
            }
        },
        mounted() {
            this.fetchGoods();
        }
    })
}
window.onload = init