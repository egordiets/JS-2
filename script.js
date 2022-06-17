const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

class GoodsItem {
    constructor({ title, price }) {
        this.title = title;
        this.price = price;
    }
    return() {
        return `
        <div class="goods-item">
            <h3>${title}</h3>
            <p>${price}</p>
        </div>
        `;
    };
}

calculatePrice() {
    return this.items.reduce((prev, { price }) => {
        return prev + price;
    }, 0)
}

class GoodsList {
    items = [];
    fetchGoods() {
        this.items = goods;
    }
    render() {
        const goods = this.items.map(item => {
            const goodItem = new GoodsItem(item);
            return goodItem.render();
        }).join('');

        document.querySelector('.goods-list').innerHTML = goodsList;
    }
}

renderGoodsList(goods);
