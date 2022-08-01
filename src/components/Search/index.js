export default Vue.component('custom-search', {
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