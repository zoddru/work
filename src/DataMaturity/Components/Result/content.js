const categories = ['Overall', 'Management', 'Use', 'Governance', 'Skills', 'Culture'];
const levels = ['Nascent', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

const content = {};

categories.forEach(category => {
    content[category] = {
        caseStudy: require(`./Content/${category}/caseStudy`).default,
        bestPractice: require(`./Content/${category}/bestPractice`).default
    };
    levels.forEach(level => {
        content[category][level] = {
            characteristics: require(`./Content/${category}/${level}/characteristics`).default,
            tips: require(`./Content/${category}/${level}/tips`).default
        };
    });
})

export default content;