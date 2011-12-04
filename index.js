var smtp = require('smtp-protocol')
  , BufferedStream = require('morestreams').BufferedStream
  , express = require('express')
  , util = require('util')
  , dateformat = require('dateformat');

var datalol = [];


var smtpserver = smtp.createServer('10.2.2.89', function (req) {
    req.on('to', function (to, ack) {
        ack.accept(250, 'Ok')
    });

    req.on('from', function (from, ack) {
        ack.accept(250, 'Ok')
    });

    req.on('message', function (stream, ack) {
        console.log(req.from + ' -> ' + req.to);
        console.log(util.inspect(this));
        var thismail = this;
        var buff = new BufferedStream();
        buff.on('end',function() {
          //console.log(this.chunks);
          //console.log('Size = ' + this.size);
          console.log(util.inspect(this));
          var mail = {};
          mail.time = new Date() - 0;
          mail.content = this.chunks;
          mail.to = thismail.to;
          mail.from = thismail.from;
          mail.size = this.size;
          datalol.push(mail);
        });
        stream.pipe(buff);
        ack.accept();
    });
});

smtpserver.listen(1025);

var routes = require('./routes');

var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
});

app.get('/', routes.index);
app.get('/mails', function(req,res) {
  res.render('mails', { title: 'Stubtailor', data: datalol  })
});


app.listen(3000);

