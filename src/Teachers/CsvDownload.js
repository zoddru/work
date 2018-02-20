import csv from 'csv';

csv.generate({ seed: 1, columns: 2, length: 10 }, (err, data) => {
    
    csv.parse(data, (err, data) => {
        
        csv.transform(data, (data) => {

            return data.map((value) => { return value.toUpperCase() });

        }, (err, data) => {
            csv.stringify(data, (err, data) => {
                process.stdout.write(data);
            });
        });
    });
});