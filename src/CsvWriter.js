// node ones are too confusing for my little brain
// csv-stringifier is broken in ie (https://github.com/kollavarsham/ng-table-to-csv/issues/7)

export default class CsvWriter {

    get delimiter () {
        return ',';
    }

    quote(text) {
        return '"' + text.replace(/"/g, '""') + '"';
    }

    quoteIfNeeded(text) {
        if (!text.indexOf(this.delimiter) && !text.indexOf('"'))
            return text;
        return this.quote(text);
    }

    write(data) {
        let output = '';

        data.forEach((r, i) => {
            if (i > 0) {
                output += '\n';
            }

            r.forEach((v, j) => {
                if (j > 0) {
                    output += this.delimiter;
                }
    
                output += this.quoteIfNeeded(v.toString());
            });
        });

        return output;
    }
}