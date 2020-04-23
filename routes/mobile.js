var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
// var User = require('../models/User');
// var Comment = require('../models/Comment');
var Ingredient = require('../models/Ingredient');
var Style = require('../models/Style');
// var File = require('../models/File');

// TODO:여기엔 ODM코드가 들어가지 않는게 좋을 것 같은데 일단 넣어봄. 테스트
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Main
router.get('/', function(req, res){

  // style, ingredient 의 코드를 가져와야 함.
  Style.find({}, function(err, styles){
    if(err) return res.json(err);
    res.render('mobile/main', {styles:styles});
  });
});

// List
router.get('/items', async function(req, res){
  let searchType = req.query.searchType;
  let keyword = req.query.keyword;
  let id = req.query.id;
  // 검색타입이 style 이면 style id가 keyword와 일치하는 음식만 검색
  // searchType=style, keyword=24erw523523523...

  // 검색타입이 ingredient 이면 ingredient id 가 keyword와 일치하는 음식만 검색
  // searchType=ingredient, keyword=745345232rf35

  // 검색타입이 Random 이면 목록에서 랜덤으로 음식 5개를 가져옴.
  // searchType=random, no keyword.
  // 랜덤함수가 필요. --> console.log(Math.round(Math.random() * [total count of posts]))
      
  // let searchQuery = await createSearchQuery(req.query);
  let posts = [];
  
  // if(searchQuery) {
    //var count = await Post.countDocuments(searchQuery);
    posts = await Post.aggregate([ // aggregate - 파이프라인으로 넘기면서 필터링 한다.
      //{ $match: searchQuery },  // $match - where 와 같음
      { $match : { style : ObjectId(id)} },//  TODO: ObjectId 를 없앨 순 없을까.
      { $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      } },
      { $unwind: '$author' },
      { $sort : { createdAt: -1 } },
      { $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments'
      } },
      { $lookup: {
          from: 'files',
          localField: 'attachment',
          foreignField: '_id',
          as: 'attachment'
      } },
      { $unwind: {
        path: '$attachment',
        preserveNullAndEmptyArrays: true
      } },
      { $project: {
          title: 1,
          body: 1,
          author: {
            username: 1,
          },
          attachment: { 
            originalFileName: 1,
            serverFileName: 1,
            // originalFileName: {
            //   $cond: {if: {$eq: [originalFileName, undefined]}, then: "default.jpg", else: originalFileName}
            // },
            // serverFileName: {
            //   $cond: {if: {$eq: [serverFileName, undefined]}, then: "default.jpg", else: serverFileName}
            // },
          },
          // views: 1,
          // numId: 1,
          // attachment: { 
          //   $cond: [{$and: ['$attachment', {$not: '$attachment.isDeleted'}]}, true, false],
          // },
          createdAt: 1,
          commentCount: { $size: '$comments'}
      } },
    ]).exec(); 
  // };
  res.render('mobile/items', {
    posts:posts,
    searchType:req.query.searchType,
    keyword:keyword,
    id:id
  });
});

// Food Details
router.get('/:id/items', function(req, res){
  res.render('mobile/details');
});

module.exports = router;

// // Post 에서 참조
// async function createSearchQuery(queries){

//   var searchQuery = {};
//   if(queries.searchType && queries.keyword){
//     var searchTypes = queries.searchType.toLowerCase().split(',');
//     var postQueries = [];
//     if(searchTypes.indexOf('style')>=0){
//       postQueries.push({ style: { $regex: new RegExp(queries.keyword, 'i') } });
//     }
//     if(searchTypes.indexOf('ingredient')>=0){
//       postQueries.push({ ingredient: { $regex: new RegExp(queries.keyword, 'i') } });
//     }
//     // if(searchTypes.indexOf('random')>=0){
//     //   postQueries.push({ body: { $regex: new RegExp(queries.keyword, 'i') } });
//     // }
//     if(postQueries.length>0) searchQuery = {$or:postQueries};
//     else searchQuery = null;
//   }
//   return searchQuery;
// }
