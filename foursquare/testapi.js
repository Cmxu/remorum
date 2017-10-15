const request = require('request');

request({
  url: 'https://api.foursquare.com/v2/venues/search',
  method: 'GET',
  qs: {
    client_id: 'EEZCISKG5XBYA2GE3VU0DGGBI3G2HABYLPFHNFOSIFXJDRUV',
    client_secret: 'MA5BI0WJUQ0MEPRQUHOUOYTUF4JXP22ZCVFSDKWO2NRS3N3Z',
    ll: '40.7243,-74.0018',
    query: 'coffee',
    v: '20170801',
    limit: 1
  }
}, function(err, res, body) {
  if (err) {
    console.error(err);
  } else {
    console.log(body);
  }
});
