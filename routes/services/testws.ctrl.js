module.exports = {
    // module init
    init: function(app) {
        app.ws('/testws', function(ws, req) {
            ws.on('message', function(msg) {
                console.log('ws triggered');
                ws.send('received something');
            });
        });

    },
}