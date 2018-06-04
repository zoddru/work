import test from 'ava';
import DmiApi from './DmApi';

test('create', t => {
    const dmiApi = new DmiApi();

    t.truthy(dmiApi);
});

test('getUrl', t => {
    const dmiApi = new DmiApi();
    t.truthy(dmiApi);

    const url = dmiApi.getUrl('one/two/three');
    t.is(DmiApi.scheme + '://' + DmiApi.host + '/one/two/three', url);
});