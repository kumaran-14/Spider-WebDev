const request = require('request')
const config = require('../../config/config.js');

//for re routing with search query string
exports.searchPage = (req,res) => {
	res.render('search',{defaultSearchString:''})
}

//rendering search page with value enetered in nav search
//note:this is not a get request, so a res.locals.user is undefined, hence user:req.session.user should be sent along
exports.navSearch = (req,res) => {
	res.render('search',{
		defaultSearchString:req.body.searchquery,
		user:req.session.user
	})
}