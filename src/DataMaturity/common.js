export default {
    toSelectOptions: items => items.map(item => { return { value: item.identifier, label: item.label } }).sort(item => item.label),

    responsesCache: new Map()
};