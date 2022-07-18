import { writeFile, readFile } from 'fs/promises'
import express from 'express';
import cors from 'cors';

const GOODS_PATH = './static/goods.json';
const BASKET = './static/basket-goods.json';

function getGoods() {
    return readFile(GOODS_PATH, 'utf-8').then((file) => JSON.parse(file))
}

function getBasket() {
    return readFile(BASKET, 'utf-8').then((file) => JSON.parse(file))
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));


app.get('/basket-goods', (req, res) => {
    Promise.all([
        getBasket(),
        getGoods()
    ]).then(([basket, goods]) => {
        return basket.map((basketGood) => {
            const good = goods.find(({ id: _goodsId }) => {
                return _goodsId === basketGood.id
            });
            return {
                ...basketGood,
                ...good
            }
        })
    }).then((result) => {
        res.send(JSON.stringify(result))
    })
});

app.get('/goods', (res, req) => {
    getGoods().then((goods) => {
        req.send(JSON.stringify(goods));
    })
});

app.listen('8000', () => {
    console.log('server is starting!')
})