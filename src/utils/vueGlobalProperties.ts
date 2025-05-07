import type { App } from 'vue'

function currency (value: number) {
    if (!value) return ''
    return (value - 0).toFixed(2)
}

export default(app:App)=>{
    app.config.globalProperties.currency = currency
}