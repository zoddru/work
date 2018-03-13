import test from 'ava';
import Response from './Response';

test('create', t => {
    const response = new Response({ identifier: 'abc' });

    t.truthy(response);
});