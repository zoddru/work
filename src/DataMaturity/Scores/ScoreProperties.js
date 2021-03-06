
const bands = Object.freeze([
    { label: 'Nascent', upperThreshold: 1.8 },
    { label: 'Basic', upperThreshold: 2.6 },
    { label: 'Intermediate', upperThreshold: 3.4 },
    { label: 'Advanced', upperThreshold: 4.2 },
    { label: 'Expert', upperThreshold: Number.POSITIVE_INFINITY }
]);

const percentageMultiplier = 20;

const minNumberOfValid = 3;
const unknownValueLabel = '---';

const getBandLabel = (value) => {
    return (bands.find(b => value < b.upperThreshold) || { label: unknownValueLabel }).label;
};

const getFunctions = {
    hasMean() {
        return typeof (this.mean) === 'number';
    },
    rankLabel() {
        if (!this.hasMean)
            return unknownValueLabel;
        return getBandLabel(this.mean);
    },
    meanDisplayName() {
        return this.hasMean
            ? (this.mean).toFixed(1)
            : unknownValueLabel;
    },
    percentage() {
        if (!this.hasMean)
            return 0;
        // this assumes that the minimum score is zero so the lowest value it can be is actually 20
        return Math.min(100, percentageMultiplier * this.mean);
    },
    isValid() {
        return this.numberOfValid >= minNumberOfValid;
    },
    fullLabel() {
        return `${this.rankLabel} (${this.meanDisplayName})${this.hasMean && !this.isValid ? ' (invalid)': ''}`;
    }
};

const props = {};

Object.keys(getFunctions).forEach(key => {
    props[key] = {
        get: getFunctions[key]
    };
});

export default Object.freeze({
    defineProperties: function (obj) {
        Object.defineProperties(obj, props);
    },
    getBandLabel
});