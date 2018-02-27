import Category from './Category';

export default class Survey {
    constructor(data) {

        const { identifier, title, categories } = data;

        this.identifier = identifier;
        this.title = title;
        this.categories = Object.freeze(Category.createArray(this, categories));

        Object.freeze(this);
    }
    
    firstCategory() {
        if (!this.categories.length)
            return null;
        return this.categories[0];
    }

    lastCategory() {
        if (!this.categories.length)
            return null;
        return this.categories[this.categories.length - 1];
    }

    get key() {
        return `survey${this.identifier}`;
    }
}