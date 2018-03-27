import config from '../../config.broker';
import OAuthAccessor from './OAuthAccessor';
import WebServices from '../Data/WebServices';
import DmApi from '../Data/DmApi';

const saveArea = (req, res, loadArea) => {
    res.setHeader('Content-Type', 'application/json');

    const oAuthAccessor = new OAuthAccessor(req, res);
    const oAuth = oAuthAccessor.get();

    if (!oAuth || !oAuth.token || !oAuth.secret) {
        res.send(JSON.stringify({ success: true, isSignedIn: false, error: 'not signed in' }));
        return;
    }

    const webServices = new WebServices(oAuth);

    loadArea(webServices)
        .then(area => {
            if (!area.success) {
                res.send(JSON.stringify(area));
                return;
            }

            new DmApi().putArea(area).catch((e) => console.log({ success: false, message: e.message }));
        });

    res.send(JSON.stringify({ success: true }));
};

export default Object.freeze({
    saveArea: (req, res) => {
        console.log(req.params.identifier);
        saveArea(req, res, ws => ws.getArea(req.params.identifier));
    },

    saveCurrentArea: (req, res) => saveArea(req, res, ws => ws.getCurrentArea()),

    saveAreaList: (req, res) => {

        const oAuthAccessor = new OAuthAccessor(req, res);
        const oAuth = oAuthAccessor.get();

        if (!oAuth || !oAuth.token || !oAuth.secret) {
            res.send(JSON.stringify({ success: true, isSignedIn: false, error: 'not signed in' }));
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
        res.send(JSON.stringify({ success: true }));
    }
});