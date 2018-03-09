const fs = require('fs');

const organisations = require('./organisations.json')['organisation-array'];

const identifiers = organisations
    .filter(org => org.governs && org.governs.areaType
        && (org.governs.areaType.identifier === 'County')
    )
    .map(org => org.identifier)
    .sort()
    .reduce((s, id) => s += id + '\r\n', '');

fs.writeFile('output.txt', identifiers);