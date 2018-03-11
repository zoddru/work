import React from 'react';

export default class Pos {
    constructor(props) {
    }

    init() {
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);
        this.posSheet = styleEl.sheet;
    }

    findTopCategoryEl() {
        const categoryEls = Array.from(document.querySelectorAll('.category')).reverse(); // probably doesn't change - could be cached
        const height = window.innerHeight;
        const topCategoryEl = categoryEls.find(s => s.getBoundingClientRect().top < window.innerHeight);
        return !!topCategoryEl ? topCategoryEl : null;
    }

    findNavEl(href) {
        return document.querySelector(`.node a[href='${href}']`);
    }

    handleScroll() {
        const topCategoryEl = this.findTopCategoryEl();
        // could find top question el and use that now
        const anchorEl = this.findNavEl(`#${topCategoryEl.id}`);
        const nodeEl = anchorEl.offsetParent;
        const containerEl = nodeEl.offsetParent;
        const height = containerEl.offsetHeight;
        const top = nodeEl.getBoundingClientRect().top - 90;

        const percent = 100 * top / height;

        console.log(top);
        console.log(percent);

        if (this.posSheet.rules.length > 0)
            this.posSheet.deleteRule(this.posSheet.rules.length - 1);
        this.posSheet.insertRule(`nav.progress::before { top: ${percent.toFixed(2)}%; }`, this.posSheet.rules.length);
    }
}