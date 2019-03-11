var express = require('express');
var path = require('path');
var nforce = require('nforce');
var hbs = require('hbs');

var app = express();

process.env.CONSUMER_KEY = "3MVG9KsVczVNcM8xvEqOmIpFuvKiReAGMqlXhPNawr88mt2mNYjeXW1rihd8On6VwDlhwpVqZ6bwDJrWZsNUj";
process.env.CONSUMER_SECRET = "84C6FD68450841B71E3C7D3DCAD51122784DB8BF2CE8A80C832EDE54FBCF8397";
app.set('view engine', 'hbs');
app.enable('trust proxy');

function isSetup() {
  return (process.env.CONSUMER_KEY != null) && (process.env.CONSUMER_SECRET != null);
}

function oauthCallbackUrl(req) {
  return req.protocol + '://' + req.get('host');
}

hbs.registerHelper('get', function(field) {
  return this.get(field);
});

app.get('/', function(req, res) {
  if (isSetup()) {
    var org = nforce.createConnection({
      clientId: process.env.CONSUMER_KEY,
      clientSecret: process.env.CONSUMER_SECRET,
      redirectUri: oauthCallbackUrl(req),
      mode: 'single'
    });

    if (req.query.code !== undefined) {
      // authenticated
      org.authenticate(req.query, function(err) {
        if (!err) {
          org.query({ query: 'SELECT id, name, type, industry, rating FROM Account' }, function(err, results) {
            if (!err) {
              console.log(results.records);
              res.render('index', {records: results.records});
            }
            else {
              res.send(err.message);
            }
          });

          org.query({ query: 'SELECT AccountId,ActivatedById,ActivatedDate,BillingAddress,BillingCity,BillingCountry,BillingGeocodeAccuracy,BillingLatitude,BillingLongitude,BillingPostalCode,BillingState,BillingStreet,BillToContactId,CompanyAuthorizedById,CompanyAuthorizedDate,ContractId,CreatedById,CreatedDate,CustomerAuthorizedById,CustomerAuthorizedDate,Description,EffectiveDate,EndDate,Id,IsDeleted,IsReductionOrder,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,OrderNumber,OrderReferenceNumber,OriginalOrderId,OwnerId,PoDate,PoNumber,Pricebook2Id,ShippingAddress,ShippingCity,ShippingCountry,ShippingGeocodeAccuracy,ShippingLatitude,ShippingLongitude,ShippingPostalCode,ShippingState,ShippingStreet,ShipToContactId,Status,StatusCode,SystemModstamp,TotalAmount,Type FROM Order ORDER BY AccountId ASC NULLS FIRST' }, function(err, results) {
            if (!err) {
              console.log(results.records);
              res.render('index', {records: results.records});
            }
            else {
              res.send(err.message);
            }
          });



        }
        else {
          if (err.message.indexOf('invalid_grant') >= 0) {
            res.redirect('/');
          }
          else {
            res.send(err.message);
          }
        }
      });
    }
    else {
      res.redirect(org.getAuthUri());
    }
  }
  else {
    res.redirect('/setup');
  }
});



app.get('/Orders', function(req, res) {
  if (isSetup()) {
    var org = nforce.createConnection({
      clientId: process.env.CONSUMER_KEY,
      clientSecret: process.env.CONSUMER_SECRET,
      redirectUri: oauthCallbackUrl(req),
      mode: 'single'
    });

    if (req.query.code !== undefined) {
      // authenticated
      org.authenticate(req.query, function(err) {
        if (!err) {
          org.query({ query: 'SELECT AccountId,ActivatedById,ActivatedDate,BillingAddress,BillingCity,BillingCountry,BillingGeocodeAccuracy,BillingLatitude,BillingLongitude,BillingPostalCode,BillingState,BillingStreet,BillToContactId,CompanyAuthorizedById,CompanyAuthorizedDate,ContractId,CreatedById,CreatedDate,CustomerAuthorizedById,CustomerAuthorizedDate,Description,EffectiveDate,EndDate,Id,IsDeleted,IsReductionOrder,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Name,OrderNumber,OrderReferenceNumber,OriginalOrderId,OwnerId,PoDate,PoNumber,Pricebook2Id,ShippingAddress,ShippingCity,ShippingCountry,ShippingGeocodeAccuracy,ShippingLatitude,ShippingLongitude,ShippingPostalCode,ShippingState,ShippingStreet,ShipToContactId,Status,StatusCode,SystemModstamp,TotalAmount,Type FROM Order ORDER BY AccountId ASC NULLS FIRST' }, function(err, results) {
            if (!err) {
              console.log(results.records);
              res.render('index', {records: results.records});
            }
            else {
              res.send(err.message);
            }
          });




          
        }
        else {
          if (err.message.indexOf('invalid_grant') >= 0) {
            res.redirect('/');
          }
          else {
            res.send(err.message);
          }
        }
      });
    }
    else {
      res.redirect(org.getAuthUri());
    }
  }
  else {
    res.redirect('/setup');
  }
});



app.get('/setup', function(req, res) {
  if (isSetup()) {
    res.redirect('/');
  }
  else {
    var isLocal = (req.hostname.indexOf('localhost') == 0);
    var herokuApp = null;
    if (req.hostname.indexOf('.herokuapp.com') > 0) {
      herokuApp = req.hostname.replace(".herokuapp.com", "");
    }
    res.render('setup', { isLocal: isLocal, oauthCallbackUrl: oauthCallbackUrl(req), herokuApp: herokuApp});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000);
console.log("Started on PORT: " + PORT);