# bitcoincoid
Node wrapper for bitcoin.co.id

Install
```
npm install bitcoincoid
```
# Example
```
var bitcoinCoId = require('../exchanges/bitcoincoid.js');

var bitcoincoid = new bitcoinCoId({
	key: "Your Key",
	secret: "Your Secret"
});


bitcoincoid.getTicker("btc_idr",
	function(err, data)
 	{
 		console.log('buy price: ' + data.ticker.buy + ' sell price: ' + data.ticker.sell);
	}
	);


bitcoincoid.transHistory(
	function(err, data)
	{
		console.log('data',data);
	}
	);
	
```
