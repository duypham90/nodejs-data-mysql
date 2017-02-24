let express     = require('express');
let app         = express();
let bodyParser  = require('body-parser');
let router      = express.Router();
let compression = require('compression');
let mysql       = require('mysql');

let oneDay = 86400000;
app.use(compression());
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.set('view engine','ejs');
app.set('views','./views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let server= require('http').Server(app);
let io= require('socket.io')(server);
let port = process.env.PORT || 8080;
server.listen(port);



let pool= mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'antuongshop'
});

// pool.connect(function(err){
// if(!!err) {
// 	    console.log("Error");
// 	} else {
// 	    console.log("Connected");
// 	}
// });

let count=0;
io.sockets.on('connection', function(socket) {
	count++;
	console.log('Co nguoi vua ket noi toi server: '+ socket.id);
	io.sockets.emit('count_user', { count: count });
	socket.on('disconnect', function(){
		count--;
		io.sockets.emit('count_user', { count: count });
	});
});
// ROUTES FOR OUR API
// router.use( (req, res, next) =>{
//   console.log('Something is happening');
//   next(); // make sure we go to next router and do not stop here
// });


app.route('/api/:id').all( (req, res, next) =>{
  next();
}).get( (req, res, next) =>{
  let {id} =  req.params;
  pool.getConnection(function(err, connection) {
	  if(!!err){
	  	connection.release();
	  	console.log('error');
	  }else{
	  	console.log('connected');
	  	connection.query( 'SELECT id,name,quantity,price,cover_photo from products where id='+id, function(err, rows, fields) {
    		connection.release();
    		if(!!err){
    			console.log('Error in the query');
    		}else{
    			res.json(rows);
  			};
	  	});
	  }
	});
})
.put( (req, res, next) =>{
  req.user.name = req.params.name;
  console.log('You do not have permision');
})
.post( (req, res, next) =>{
  console.log('You do not have permission');
  res.json({'massage': 'Error! you do not have permission'})
})
.delete( (req, res, next) =>{
  let {id} = req.params;
  res.json(id);
  //next( new Error('not implemented'));
})
app.get('/', function(req,res){
	pool.getConnection(function(err, connection) {
	  if(!!err){
	  	connection.release();
	  	console.log('error');
	  }else{
	  	console.log('connected');
	  	connection.query( 'SELECT id,name,quantity,price,cover_photo from products ORDER BY id DESC LIMIT 30', function(err, rows, fields) {
	  		connection.release();
	  		if(!!err){
	  			console.log('Error in the query');
	  		}else{
	  			let seoPage={
					title:'Demo node js',
					description:'Page description',
					keyword:'keyword node js',
					header:'Page header'
				};
				//console.log(rows);
	  			res.render('index',{data:rows,local:seoPage})
	  		}
	  	});
	  }
	});
});
