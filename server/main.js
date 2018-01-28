import { Meteor } from 'meteor/meteor';

import { Links } from '../imports/collections/links';

import { WebApp } from 'meteor/webapp';

import connectRoute from 'connect-route';


Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('links', function() {
      return Links.find({});
  });
});

function onRoute(req, res, next){
  // take the token out of the hte url and
  // try to find a matching link in the links collection
  const link = Links.findOne({ token: req.params.token, })

  if (link) {
    Links.update(link, { $inc: { clicks: 1 } });
    // if we find a link object we redirect the user
    res.writeHead(307, { 'Location': link.url });
    res.end();
  }
  else {
    // else redirect to our react app
    next();
  }
}

const middleware = connectRoute(function(router) {
  router.get('/:token', onRoute);
});

WebApp.connectHandlers
  .use(middleware);
