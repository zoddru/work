import resultData from '../Components/Result/resultData';
import React from 'react';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fs from 'fs';

configure({ adapter: new Adapter() });

const categories = Object.keys(resultData);

categories.forEach(c => {
    const cat = resultData[c];
    const sections = Object.keys(cat);

    sections.forEach(s => {
        const sec = cat[s];
        const levels = Object.keys(sec);

        levels.forEach(l => {
            const content = sec[l];

            let contentHtml;
            if (Array.isArray(content) && content.length > 1) {
                contentHtml = <ul>{content.map(c => <li>{c}</li>)}</ul>;
            }
            else {
                contentHtml = <p>{content}</p>;
            }

            const el = <div replacemewithclassname={`${s}`}>
                {contentHtml}
            </div>;

            const wrapper = shallow(el);

            const output = `import React from 'react';
            export default ${wrapper.html().replace(/replacemewithclassname/, 'className')};`;
            
            const dir1 = `D:/Junk/TEST/${c}`;

            try {
                fs.mkdirSync(dir1);
            }
            catch(e) {
                //console.log(e);
            }

            const dir2 = `${dir1}/${l}`;

            try {
                fs.mkdirSync(dir2);
            }
            catch(e) {
                //console.log(e);
            }

            fs.writeFileSync(`${dir2}/${s}.js`, output);
        });
    });
});