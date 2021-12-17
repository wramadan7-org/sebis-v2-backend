const moment = require('moment');

const convertDate = async (data) => {
    const defaultDate = moment('01-01-2000').format('DD-MM-YYYY')
    const spliting = data.split('/');

    if (spliting.length == 2) {
        if (spliting[0].length == 2 && spliting[1].length == 4 && spliting[0].match(/\d+/g) && spliting[1].match(/\d+/g)) {
            const newDate = `${spliting[0]}-01-${spliting[1]}`;
            const momentDate = moment(new Date(newDate)).isValid() === true ? moment(new Date(newDate)).format('DD-MM-YYYY') : defaultDate;

            return momentDate;
        } else {
            return defaultDate;
        }
    } else {
        return defaultDate;
    };

};

module.exports = {
    convertDate,
};