//handling routes
var config  = require('./config');

module.exports = {

  index: function(req, res) {
        console.log('index.js')
        res.sendFile(__dirname + '/public/views/index.html');
  }
}