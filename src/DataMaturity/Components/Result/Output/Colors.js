const byType = Object.freeze({
    respondent: '#d64f82',
    organisation: '#96a334'
});

const colors = ['#CF7B25', '#8EAA94', '#C7B757', '#BCCBE8', '#f8c27c', '#c2a0f5', '#acd5b6', '#83128d', '#d75466', '#e3125c', '#422d5e', '#17a2b8', '#076443', '#ffb3dc', '#ff9e45', '#72ba3a', '#f0d000', '#5e8579', '#343a40'];

const getColor = (s, i) => byType[s.key.type] || colors[i % colors.length];

const getColorMap = (scores) => {
    const colorMap = new Map();
    
    scores.forEach((s, i) => colorMap.set(s, getColor(s, i)));

    return colorMap;
};

export default Object.freeze({
    getColorMap,
    byType
});