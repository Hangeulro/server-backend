module.exports = (router, func, Words, to) => {
  router.get('/word', async (req, res) =>{
    const [err, words] = await to(Words.find({})); //에러가나면 err객체에 정상적으로 return되면 words에 들어감

    if(words) return res.status(200).send(word);
    if(err) return res.status(500).send(err);
  })

  .post('/find', async(req, res)=>{
    var sh = req.body.search;
    var data = [];
    const [err,words] = await to(Words.find({$or: [{word: { $regex: sh }}, {cata: {$elemMatch: { $regex: sh }}}, {similar: {$elemMatch: { $regex: sh }}}]}));
    //바디에 들어가있는 sh를 contain하고있는 카테고리를 검색해옴
    if(err) return res.status(400).send(err);
    else return words.length > 0 ? res.status(200).send(words):res.status(404).send("DB에 없거나 잘못검색하셨습니다");
  })

  .get('/cata/:cata', async(req, res)=>{
    var cata = req.params.cata;
    var data = [];

    const [err, catas] = await to(Words.find({cata: {$elemMatch: { $regex: cata }}}));
    if(err) return res.status(400).send(err);
    return catas.length > 0 ? res.status(200).send(catas):res.status(404).send("DB에 없거나 잘못검색하셨습니다");
  })

  //더이상 사용되지않음
  .post('/comment', async (req, res)=>{
    var params = ['token', 'date', 'id', 'summary'];
    if(!func.check_param(req.bdoy, params, token)) return res.status(400).send("param missing");
    var token = req.body.token;
    var date = req.body.date+"";
    var id = req.body.wordid+"";
    var summary = req.body.summary+"";
    //안드로이드에서 이상한 데이터 타입으로 보네서 강제로 스트링으로 변환해야했었음

    //전송받은 유저의 토큰으로 유저 검색
    const [err, users] = await to(Users.findOne({token: token}));
    if(err) return res.status(401).send("vaild token");
    
    //단어의 ID로 DB에서 서칭하여 댓글 배열에 추가
    const [err, result] = await to(Words.update({id : id}, {$push : {comments : {writer: user.name, date: date, summary: summary, profile_image: user.profile_image}}}));
    if(err) return res.status(500).send("DB Error");

    //간혹 컨플릭트나 ok가아닌 스테이터스가 뜨기때문에 result.ok가 1 이상이 나오면 정상적으로 처린된거임
    if(result.ok > 0){
      //변경된것을 보네줘야함
      const [err, users] = await to(Words.findOne({id: id}));
      return res.status(200).send(word);
    }else return res.status(412).send("nothing chenged");
  })

  .get('/word/:wordid', async (req, res)=>{
    //word 조회
    var params = ['wordid'];
    var wordId = req.params.wordid+"";
    var data;

    //간혹 클라이언트가 이상한 id값을 전송할때있음 isNaN을 통해 넘버인지 아닌지 판단
    if(Number.isNaN(parseInt(wordId)) || !func.check_param(req.params, params))
      res.status(400).send("param missing");


    const [err, result] = await to(Words.findOne({id: wordId}));
    if (err) return res.status(500).json(err);
    
    if(result){
      //해당 워드에 저장되있는 조회수를 가져옴
      var up = result.see;
      var id = result.id+"";
      up++;
      //조회수 증가후 업데이트
      const [err, words] = await to(Words.update({id: id}, {$set : {see: up}}));
      if(err) return res.status(500).json(err);
      
      if(words) return res.status(200).json([result]);
      }else
        return res.status(404).send("not found");
    });
  });

  return router;
}
