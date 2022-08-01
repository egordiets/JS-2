import './style.css';
import './components/BasketItem';
import './components/CustomButton';
import './components/BasketGoods';
import './components/GoodsItems';
import './components/Search';

import { BASE_URL, GOODS, GET_GOODS_ITEMS, GET_BASKET_GOODS_ITEMS } from './constants';

import { service, serviceWithBody } from './service';

function init() {

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