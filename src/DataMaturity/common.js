export default {
    toSelectOptions: items => items.map(item => { return { value: item.identifier, label: item.label } }).sort(item => item.label),

    filtersCache: new Map(),
    responsesCache: new Map()
};