const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

const GET_GOODS_ITEMS = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json';
const GET_BASKET_GOODS_ITEMS = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json';

function service(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
        callback(JSON.parse(xhr.response))
    }
    xhr.send();
}

class GoodsItem {
    constructor({ product_name, price }) {
        this.title = product_name;
        this.price = price;
    }
    return() {
        return `
        <div class="goods-item">
            <h3>${this.title}</h3>
            <p>${this.price}</p>
        </div>
        `;
    };
}

class GoodsList {
    items = [];
    fetchGoods(callback) {
        service(GET_GOODS_ITEMS, (data) => {
            this.items = data;
            callback();
        });
    }
    calculatePrice() {
        return this.items.reduce((prev, { price }) => {
            return prev + price;
        }, 0)
    }
    render() {
        const goods = this.items.map(item => {
            const goodItem = new GoodsItem(item);
            return goodItem.render();
        }).join('');

        document.querySelector('.goods-list').innerHTML = goods;
    }
}

class BasketGoods {
    items = [];
    fetchGoods(callback = () => { }) {
        service(GET_BASKET_GOODS_ITEMS, (data) => {
            this.items = data;
            callback();
        });
    }
}

const basketGoods = new BasketGoods();
basketGoods.fetchGoods();

const goodsList = new GoodsList();
goodsList.fetchGoods(() => {
    goodsList.render();
});
