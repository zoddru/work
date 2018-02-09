import PayModel from './PayModel';

export default class PayModelStore {
    constructor(data) {

        this._data = data;
        this._cache = {};
                
        Object.freeze(this);
    }

    getFromCache(year, area) {
        const cache = this._cache;
        const yearKey = year.toString();
        const cachedModel = cache[yearKey] && cache[yearKey][area];
        if (cachedModel)
            return cachedModel;
        const data = this._data;
        const payPoints = data[yearKey] && data[yearKey][area];
        if (!payPoints)
            return null; // or maybe return a new payModel
        
        const payModel = PayModel.create({ year, area, payPoints });
        this.store(payModel);
        return payModel;
    }

    get(year, area, percentageIncrease) {
        let payModel = this.getFromCache(year, area);

        if (percentageIncrease === undefined)
            return payModel;

        if (payModel.percentageIncrease === percentageIncrease)
            return payModel;

        payModel = payModel.change({percentageIncrease});
        this.store(payModel);
        return payModel;
    }

    store(payModel) {
        const cache = this._cache;
        const { year, area } = payModel;
        const yearKey = year.toString();

        if (!cache[yearKey]) {
            cache[yearKey] = {};
        }
        
        cache[yearKey][area] = payModel;
    }

    first() {
        const data = this._data;
        const years = Object.keys(data);
        if (!years.length)
            return null;
        const year = years[0];
        const yearData = data[year];
        if (!yearData)
            return null;
        const areas = Object.keys(yearData);
        if (!areas.length)
            return null;
        return this.get(parseInt(year), areas[0]);
    }
}