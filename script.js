const BASE_URL = 'http://localhost:8000/';
const GOODS = `${BASE_URL}goods`;
const GET_GOODS_ITEMS = `${BASE_URL}goods.json`
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}basket-goods`

function service(url) {
    return fetch(url)
        .then((res) => res.json())
}

function serviceWithBody(url = "", method = "POST", body = {}) {
    return fetch(
        url,
        {
            method,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body)
        }
    ).then((res) => res.json())
}

function init() {
    Vue.component('custom-search', {
        model: {
            prop: 'value',
            event: 'input'
        },
        props: [
            'value'
        ],
        template: `
            <input type="text" class="goods-search" @input="$emit('input', $event.target.value)"/>
        `
    })

    const BasketItem = Vue.component('basket-item', {
        props: [
            'item'
        ],
        template: `
            <div class="basket-item">
                <div class="basket-item_field">
                    <span class="basket-item_title">{{ item.product_name }}</span>
                    <span class="basket-item_price">({{ item.price }}р. )</span>
                </div>
                <div class="basket-item_count">
                    <span>{{ item.count }}шт.</span>
                    <button @click="$emit('add', item.id)">+</button>
                    <button @click="$emit('delete', item.id)">-</button>
                </div>
            </div>
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

    const goodsItem = Vue.component('goods-item', {
        props: [
            'item'
        ],
        template: `
            <div class="goods-item">
               <h3>{{ item.product_name }}</h3>
               <p>{{ item.price }}</p>
               <div>
                    <custom-button @click="addGood">Добавить</custom-button>
               </div>
            </div>
        `,
        methods: {
            addGood() {
                serviceWithBody(GOODS, "POST", {
                    id: this.item.id
                })
            }
        }
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
            addGood(goodId) {
                servicePost(GET_BASKET_GOODS_ITEMS, {
                    id: goodId,
                })
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