const respondentColor = '#B43F6B';
const organisationColor = '#737D27';

const colors = ['#000000', '#CF7B25', '#8EAA94', '#C7B757', '#0056b3', '#f8c27c', '#c2a0f5', '#acd5b6', '#83128d', '#d75466', '#e3125c', '#422d5e', '#17a2b8', '#076443', '#ffb3dc', '#ff9e45', '#72ba3a', '#f0d000', '#5e8579', '#343a40'];

const getColor = (s, i) => {
    if (s.key.type === 'respondent')
        return respondentColor;
    if (s.key.type === 'organisation')
        return organisationColor;
    return colors[i % colors.length];
};

const getColorMap = (scores) => {
    const colorMap = new Map();
    
    scores.forEach((s, i) => colorMap.set(s, getColor(s, i)));

    return colorMap;
};

export default {
    getColorMap
};