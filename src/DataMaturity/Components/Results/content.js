const categories = ['Overall', 'A', 'B', 'C', 'D', 'E'];
const levels = ['Nascent', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

const content = {};

categories.forEach(category => {
    content[category] = {
        caseStudy: require(`./Content/${category}/caseStudy`).default
    };
    levels.forEach(level => {
        content[category][level] = {
            characteristics: require(`./Content/${category}/${level}/characteristics`).default,
            tips: require(`./Content/${category}/${level}/tips`).default
        };
    });
})

export default content;