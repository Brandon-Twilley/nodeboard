const imgur = require('imgur-node-api');
const multer = require('multer');
const path = require('path');
const uuidv1 = require('uuid/v1');
const credentials = require('./credentials');


imgur.setClientID(credentials.imgurClientID);

upload_image = function(name){
     let image_url = '';
     imgur.upload(path.join(__dirname + '/image_store', name), function(err, res){
          console.log('link: ', res.data.link);
          image_url = res.data.link;
     });
     return image_url;
}

get_image = function(){
     let storage = multer.diskStorage({
          destination: function(req, file, callback) {
               callback(null, 'image_store');     //tells us where we store that image
          },
          filename: function(req, file, callback) {
               var ext = path.extname(filename||'').split('.');
               callback(null, get_uuid() + ext[ext.length-1]);
          }
     });
}

get_uuid = function(){
	return uuidv1();
}

upload_image('test_image.jpg');
