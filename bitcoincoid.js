var querystring = require("querystring"),
VError = require('verror'),
crypto = require("crypto"),
https =require('https'),
url = require('url');

var self;

var bitcoinCoId = function bitcoinCoId(settings)
{
	self = this;
	this.key = settings.key; 
	this.secret = settings.secret;
	this.url =  settings.url || "https://vip.bitcoin.co.id/api";
	this.tradeUrl = settings.tradeUrl || "https://vip.bitcoin.co.id/tapi/";
};


function makePublicRequest( path, args, callback)
{
	var functionName = 'bitcoinCoIdbitcoinCoId.makePublicRequest()';
	var options = url.parse(self.url+path);
	options.method = "GET";
	executeRequest(options, new Buffer({}, 'utf8'), callback);
};


function makePrivateRequest(method, args, callback)
{
	var functionName = 'bitcoinCoIdbitcoinCoId.makePrivateRequest()';
	var uri = self.tradeUrl;
	var nonce = (new Date()).getTime();

	args.nonce = nonce;

	if (!self.key || !self.secret)
	{
		return callback(new VError("%s must provide key and secret to make a private API request.", functionName));
	}

	postData = JSON.stringify(args);
	var content_data = querystring.stringify(args);

	var signature = crypto
	.createHmac('sha512', new Buffer(self.secret, 'utf8'))
	.update(new Buffer(content_data, 'utf8'))
	.digest('hex');

	var options = url.parse(self.tradeUrl);
	options.method = 'POST'
	options.headers = {
		'Key': self.key,
		'Sign': signature,
		'content-type': 'application/x-www-form-urlencoded',
		'content-length': content_data.length,
	}
	executeRequest(options, content_data, callback);
};

function executeRequest(options,content, callback){
	var functionName = 'bitcoincoid.executeRequest()';
	var req = https.request(options, function(res) {
		var data = ''
		res.setEncoding('utf8')
		res.on('data', function (chunk) {
			data+= chunk
		})
		res.on('end', function() {
			try{
				data = JSON.parse(data);
				callback(null,data);
			}
			catch(e){
				return callback(new VError("%s Error in Parsing Data to JSON", functionName));
			}
			
		})
	});
	

	req.on('error', function(err) {
		return callback(new VError("%s Error in Parsing request", functionName));
	})
	if(options.method == 'POST'){
		req.write(content);
	}	
	req.end();
}


bitcoinCoId.prototype.getTicker = function(tickerSymbol, callback)
{
	makePublicRequest( "/"+tickerSymbol+"/ticker", {}, callback);
};

bitcoinCoId.prototype.getTrades = function(tickerSymbol, callback)
{
	makePublicRequest( "/"+tickerSymbol+"/trades", {}, callback);
};

bitcoinCoId.prototype.getDepth = function(tickerSymbol, callback)
{
	makePublicRequest( "/"+tickerSymbol+"/depth", {}, callback);
};


bitcoinCoId.prototype.getInfo = function(callback)
{
	makePrivateRequest("POST", {"method":"getInfo"}, callback);
};

bitcoinCoId.prototype.transHistory = function(callback)
{
	makePrivateRequest("POST", {"method":"transHistory"}, callback);
};

bitcoinCoId.prototype.tradeHistory = function(params, callback)
{
	params.method = "tradeHistory";
	makePrivateRequest("POST", params, callback);
};

bitcoinCoId.prototype.openOrders = function(params, callback)
{
	params.method = "openOrders";
	makePrivateRequest("POST", params, callback);
};

bitcoinCoId.prototype.trade = function(params, callback)
{
	params.method = "trade";
	makePrivateRequest("POST", params, callback);
};

bitcoinCoId.prototype.cancelOrder = function(params, callback)
{
	params.method = "cancelOrder";
	makePrivateRequest("POST", params, callback);
};



module.exports = bitcoinCoId;