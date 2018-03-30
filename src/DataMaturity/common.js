export default Object.freeze({
    toSelectOptions: items => items.map(item => { return { value: item.identifier, label: item.label } }).sort(item => item.label),

    filtersCache: new Map(),
    responsesCache: new Map(),

    stringifyReplcacers: Object.freeze({
        getNoCircular: () => {
            const cache = [];
            return (key, value) => {
                if (typeof value !== 'object' || value === null)
                    return value;
                if (cache.indexOf(value) !== -1)                    
                    return; // Circular reference found, discard key
                cache.push(value); // Store value in our collection
                return value;
            };
        }
    })
});