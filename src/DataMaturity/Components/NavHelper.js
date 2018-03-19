export default Object.freeze({
    findTopElement: (querySelector, items, startKey) => {
        const elements = Array.from(window.document.querySelectorAll(querySelector)).reverse();
        const height = window.innerHeight;
        const topEl = elements.find(el => el.getBoundingClientRect().top < window.innerHeight);

        if (!topEl)
            return { isStart: true };

        const itemKey = topEl.id;

        if (!itemKey)
            return { isStart: true };
        if (startKey && itemKey === startKey)
            return { isStart: true };
        if (itemKey === 'end')
            return { isEnd: true };

        return items.find(s => s.key === itemKey) || { end: true };
    },

    findTopQuestion: (category) => {
        if (!category || !category.questions)
            return null;
        const categoryEl = window.document.querySelector(`.category[id='${category.key}']`);
        if (!categoryEl)
            return null;
        const questionEls = Array.from(window.document.querySelectorAll('.question')).reverse();
        const height = window.innerHeight;
        const topQuestionEl = questionEls.find(s => s.getBoundingClientRect().top < window.innerHeight);

        if (!topQuestionEl)
            return null;

        const questionKey = topQuestionEl.id;

        return category.questions.find(s => s.key === questionKey);
    }
});