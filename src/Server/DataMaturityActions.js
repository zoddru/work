import config from '../../config.broker';
import urlParser from 'url';
import OAuthAccessor from './OAuthAccessor';
import WebServices from '../Data/WebServices';
import DmApi from '../Data/DmApi';

const isCompleteOAuth = (oAuth) => {
    return oAuth && oAuth.token && !!oAuth.secret;
};

const getWebServices = (req, res) => {
    const oAuth = new OAuthAccessor(req, res).get();

    if (!isCompleteOAuth(oAuth)) {
        return false;
    }

    return new WebServices(oAuth);
};

const saveArea = (req, res, loadArea) => {
    res.setHeader('Content-Type', 'application/json');

    const webServices = getWebServices(req, res);

    if (!webServices) {
        res.send({ success: true, isSignedIn: false, message: 'not signed in' });
        return;
    }

    loadArea(webServices)
        .then(area => {
            if (!area.success) {
                return;
            }

            new DmApi().putArea(area).catch((e) => console.log({ success: false, message: e.message }));
        });

    res.send({ success: true });
};

const getCurrentResponseOptions = (req, res) => {
    const webServices = getWebServices(req, res);

    if (!webServices) {
        return new DmApi().getResponseOptions();
    }

    return webServices.getCurrentUser()
        .then(result => {
            const user = result.data.user;

            if (!user || !user.organisation || !user.organisation.governs || !user.organisation.governs.identifier) {
                return new DmApi().getResponseOptions();
            }

            const owner = user.organisation.governs.identifier;
            return new DmApi().getResponseOptions({ owner });
        });
};

export default Object.freeze({
    saveArea: (req, res) => {
        saveArea(req, res, ws => ws.getArea(req.params.identifier));
    },

    saveCurrentArea: (req, res) => saveArea(req, res, ws => ws.getCurrentArea()),

    currentResponseOptions: (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        getCurrentResponseOptions(req, res)
            .then(result => {
                res.send(result.data)
            })
            .catch(error => {
                res.send({ error: true, message: error.message, stack: error.stack });
            });
    },

    saveAreaList: (req, res) => {

        const oAuthAccessor = new OAuthAccessor(req, res);
        const oAuth = oAuthAccessor.get();

        if (!oAuth || !oAuth.token || !oAuth.secret) {
            res.send({ success: true, isSignedIn: false, error: 'not signed in' });
            return;
        }

        const webServices = new WebServices(oAuth);

        const list = [
            'E07000073', 'E08000026', 'E10000020', 'E10000030', 'E10000002', 'E10000031', 'E10000021', 'E10000032', 'E10000023', 'E10000018',
            'E10000018', 'E10000025', 'E10000018', 'E10000009', 'E10000003', 'E10000023', 'E10000019', 'E10000028', 'E10000031',
            'E10000017', 'E10000034', 'E10000025', 'E10000017', 'E10000020', 'E10000018', 'E10000031', 'E10000031', 'E10000017',
            'E10000031', 'E10000007', 'E10000012', 'E10000027', 'E10000029', 'E10000030', 'E10000003', 'E10000013', 'E10000009',
            'E10000011', 'E10000032', 'E10000023', 'E10000014', 'E10000029', 'E10000028', 'E10000007', 'E10000006', 'E10000031',
            'E10000034', 'E10000024', 'E10000023', 'E10000028', 'E10000003', 'E10000014', 'E10000032', 'E10000031', 'E10000032',
            'E10000011', 'E10000034', 'E10000032', 'E10000018', 'E10000016', 'E10000034', 'E10000009', 'E10000003', 'E10000020',
            'E10000018', 'E10000027', 'E10000028', 'E10000008', 'E10000007', 'E10000003', 'E10000017', 'E10000023', 'E10000011',
            'E10000027', 'E10000015', 'E10000015', 'E10000007', 'E10000003', 'E10000021', 'E10000014', 'E10000023', 'E10000023',
            'E10000002', 'E10000008', 'E10000021', 'E10000025', 'E10000024', 'E10000011', 'E10000024', 'E10000014', 'E10000018',
            'E10000019', 'E10000032', 'E10000034', 'E10000013', 'E10000009', 'E10000031', 'E10000013', 'E10000018', 'E10000003',
            'E10000012', 'E10000002'
        ];

        const dmApi = new DmApi();
        const putArea = a => {
            console.log(a.identifier);
            dmApi.putArea(a)
                .catch((e) => console.log('error: ' + e.message));
        };

        list.forEach(a => webServices.getArea(a).then(putArea));

        res.setHeader('Content-Type', 'application/json');
        res.send({ success: true });
    },

    responses: (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const urlObj = urlParser.parse(req.url, true);
        const filters = parseFilters(ensureArray(urlObj.query.filter));
        const types = filters.map(f => f.type).filter((t, i, self) => self.indexOf(t) === i); // distinct

        res.send({ success: true, filters, types });
    }
});

const ensureArray = (value) => {
    if (Array.isArray(value))
        return value;
    if (typeof (value) === 'undefined')
        return [];
    return [value];
};

const filterRegex = /([^-]+)-(.+)/;
const parseFilter = (filter) => {
    const match = filter.match(filterRegex);
    if (!match)
        return null;
    return {
        type: match[1],
        identifier: match[2]
    };
};

const parseFilters = (filters) => {
    return filters.map(parseFilter).filter(f => !!f);
};