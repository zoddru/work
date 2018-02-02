function init(status) {
    var app = new Vue({
        el: 'body > header',
        data: status
    });
}

axios.get('/status.json')
    .then(function (response) {
        console.log(response.data);
        init(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });