# Hangeulro
한글을 한글로! Project (2016 Smarteen App Challenge) - Server Backend

# Contributor
* UI/UX Designer [Taeyun Kim](https://github.com/tyk117)
* Android Client Developer [Junseok Oh](https://github.com/kotohana5706)
* iOS Client Developer / Video Director [Joonwoo Jeong](https://github.com/LyinT)
* Server Backend Developer [Younjune Kim](https://github.com/iwin2471)
* Service Planner / DB Manager [Changhyeon Nam]()

# Hangeulro-server
hangeulro Project (smarteen app challenge 2016) Node.JS Backend

## API Document

* Common Response

    HTTP 200: Success

    HTTP 400: DB error

    HTTP 401: Bad Request

    HTTP 403: Params Missing

* POST /auth/login : User Login

> Params

    userid : User's ID [String]

    pw : User's   Password [String]

> Response

    HTTP 200 : User

    HTTP 400 : No user

    HTTP 401 : ID / Password Incorrect

* POST /auth/login/auto : Auto Login

> Params

    token : token [String]

> Response

    HTTP 200 : UserID and token or apikey

    HTTP 401 : Access Denied


* POST /auth/register : User Register

> Params

    userid : User's ID [String]

    pw : User's Password [String]

    username : User's Name [String]


> Response

    HTTP 200 : User

    HTTP 300 : already exists

    HTTP 400 : DB Error
    
* GET /auth/fb/token : send 

> Params

    access_token : access token


> Response

    HTTP 200 : send user

    HTTP 400 : DB Error
    
* GET /auth/tw/token : send tw token 

> Params

    oauth_token : oauth_token
    
    oauth_token_secret: oauth_token_secret
    
    user_id: user_id

> Response

    HTTP 200 : send user

    HTTP 400 : DB Error 

* POST /word

> Response

    HTTP 200 : all word's

    HTTP 401 : Bad Request

* POST /word/find

> Params

    search : word search in word or similar word's [String]

> Response

    HTTP 200 : return word [String Json]

    HTTP 401 : No word Found

* POST /word/cata

> Params

    cata : word catalog  [String]

> Response

    HTTP 200 : return word [String Json]

    HTTP 401 : No word Found
 
    
* POST /word/getWordInfo

> Params

    wordid : word id to get word Info  [String]

> Response

    HTTP 200 : return word Info [String Json]

    HTTP 401 : No word Found
    
* POST /word/commentAdd

> Params

    token : writer token [String]
    date : write date [String]
    wordid : wordid to write [String]
    summary : comment summary [String]

> Response

    HTTP 200 : return word Info [String Json]

    HTTP 401 : No word Found

* GET /version

> Response

    HTTP 200 : return version [String]


* POST /mydic
    > Params

        token: mydic owner token  [String]

    > Response

        HTTP 200 : return mydic list [String array]

        HTTP 409 : send reason "already exists" or DB ERROR

* POST /mydic/make

> Params

    token: mydic owner token  [String]

    sub: mydic sub title [String]

    dicname: mydic name  [String]

> Response

    HTTP 200 : Success

    HTTP 409 : DB ERROR


* POST /mydic/add

> Params

    token: mydic token  [String]

    dicname: mydic name  [String]

    id: add word id [String]

> Response

    HTTP 200 : return word list [String array]

    HTTP 409 : send reason "already exists" or DB ERROR

* POST /mydic/pop

> Params

    token: mydic owner token  [String]

    dicname: mydic name  [String]

    id: pop word id [String]

> Response

    HTTP 200 : return word list [String array]

    HTTP 409 : send reason "already exists" or DB ERROR


* POST /board

> Response

    HTTP 200 : return board json


* POST /board/write


> Params

        file: if user upload image use key file

        token: writer token  [String]

        date: date  [String]

        title: title name [String]

        contnets: contnets [String]

> Response

        HTTP 200 : return Success

        HTTP 409 : send reason "already exists" or DB ERROR


* POST /board/commentAdd

> Params

  token: writer token  [String]

  boardid: boardid [String]

  summary: board summary [String]

  date: write date [String]

> Response

    HTTP 200 : return Success

    HTTP 400 : not vaild token

    HTTP 409 : send reason "already exists" or DB ERROR
    
* POST /board/detail

> Params

  boardid: boardid [String]

> Response

    HTTP 200 : return board detail

    HTTP 400 : not vaild id
    
* GET /quize

> Params

  nope

> Response

    HTTP 200 : return random word
    
## Database Schema

### User

> id : User's id [String required unique]

> pw : User's Password [String required]

> apikey : User ApiKey [String]

> token : User token [String]

> mydic : User's Custom dictionary [Array]
>> dicname: dictionary list [String]
>> favorite: contents list [number Array]
> (Array Contains ONLY word's id)

### Word

> id: word's ID [String]

> word : this Word [String]

> mean : Word's mean [String]

> ex : Word's example [String]

> similar : similar Word [String Array]

> cata : catalog [String Array]

> tag : tag of Word [String Array]

> comments: [{
   writer: {type: String},
   date: {type: String},
   summary: {type: String}
  }]

### board

> boardid: boardid [String]

> writer: boardWriter [String]

> writerToken: writerToken [String]

> imageurl: boardimageurl [String]

> date : boardWriteDate [Date]

> good :  [Number]

> bad : [Number]

> comments:[{
       writer: {type: String},
       date: {type: String},
       summary: {type: String}
     }]

### mydic

> dicname: {type: String}

> sub: {type: String}

> favorite: [String array]

> owner: {type: String}
