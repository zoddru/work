const byType = Object.freeze({
    respondent: '#d64f82',
    organisation: '#96a334'
});

const colors = ['#bccbe8', '#c7b757', '#acd5b6', '#c2a0f5', '#83128d', '#cf7b25', '#f8c27c', '#d75466', '#e3125c', '#422d5e', '#17a2b8', '#076443', '#8eaa94', '#ffb3dc', '#ff9e45', '#72ba3a', '#f0d000', '#5e8579', '#343a40'];

const getColorMap = (scores) => {
    const colorMap = new Map();
    let nextIndex = 0; 

    scores.forEach(s => {
        const typeColor = byType[s.key.filterType];
        
        if (typeColor) {
            return colorMap.set(s, typeColor);
        }

        const index = nextIndex % colors.length;
        nextIndex += 1;

        return colorMap.set(s, colors[index]);
    });

    return colorMap;
};

export default Object.freeze({
    getColorMap,
    byType
});