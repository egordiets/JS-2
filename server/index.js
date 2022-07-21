import { writeFile, readFile } from 'fs/promises'
import express from 'express';
import cors from 'cors';

const GOODS_PATH = './static/goods.json';
const BASKET_PATH = './static/basket-goods.json';

function getGoods() {
    return readFile(GOODS_PATH, 'utf-8').then((file) => JSON.parse(file))
}

function getBasket() {
    return readFile(BASKET_PATH, 'utf-8').then((file) => JSON.parse(file))
}

function getReformBasket() {
    return Promise.all([
        getBasket(),
        getGoods()
    ]).then(([basket, goods]) => {
        const result = basket.map((basketGood) => {
            const good = goods.find(({ id: _goodsId }) => {
                return _goodsId === basketGood.id
            });
            return {
                ...basketGood,
                ...good
            }
        })
        return result
    })
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.post('/basket-goods', (res, req) => {
    getBasket().then((basket) => {
        const basketItem = basket.find(({ id: _id }) => _id === res.body.id);
        if (!basketItem) {
            basket.push({
                id: res.body.id,
                count: 1,
            })
        } else {
            basket = basket.map((basketItem) => {
                if (basketItem.id === res.body.id) {
                    return {
                        ...basketItem,
                        count: basketItem.count + 1
                    }
                } else {
                    return basketItem
                }
            })
        }
        return writeFile(BASKET_PATH, JSON.stringify(basket)).then(() => {
            return getReformBasket()
        }).then((result) => {
            req.send(result)
        })
    })
})

app.delete('/basket-goods', (res, req) => {
    getBasket().then((basket) => {
        const basketItem = basket.find(({ id: _id }) => _id === res.body.id);
        if (basketItem.count < 2) {
            basket.pop()
        } else {
            basket = basket.map((basketItem) => {
                if (basketItem.id === res.body.id) {
                    return {
                        ...basketItem,
                        count: basketItem.count - 1
                    }
                } else {
                    return basketItem
                }
            })
        }
        return writeFile(BASKET_PATH, JSON.stringify(basket)).then(() => {
            return getReformBasket()
        }).then((result) => {
            req.send(result)
        })
    })
})

app.get('/basket-goods', (req, res) => {
    getReformBasket().then((result) => {
        res.send(JSON.stringify(result))
    })
});

app.listen('8000', () => {
    console.log('server is starting!')
})