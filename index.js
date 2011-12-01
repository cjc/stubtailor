var smtp = require('smtp-protocol')
  , BufferedStream = require('morestreams').BufferedStream;

var server = smtp.createServer(function (req) {
    req.on('to', function (to, ack) {
        ack.accept()
    });

    req.on('message', function (stream, ack) {
        console.log(req.from + ' -> ' + req.to);
        var buff = new BufferedStream();
        buff.on('end',function() {
          console.log(this.chunks);
          console.log('Size = ' + this.size);
        });
        stream.pipe(buff);
        ack.accept();
    });
});

server.listen(1025);
