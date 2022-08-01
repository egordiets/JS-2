export default Vue.component('basket-item', {
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