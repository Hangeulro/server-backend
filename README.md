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

api document will migrate to [here](http://github.com/Hangeulro/server-backend/wiki)

* Common Response
  (all DB err change 409 to 500)
  HTTP 200: Success

  HTTP 400: Params Missing

  HTTP 401: Bad Request

  HTTP 404: not found

  HTTP 500: DB error

* POST /auth/login : User Login

> Params

    userid : User's ID [String]

    pw : User's   Password [String]

> Response

    HTTP 200 : send User

    HTTP 401 : ID / Password Incorrect

* POST /auth/auto : Auto Login

> Params

    token : token [String]

> Response

    HTTP 200 : UserID and token or apikey

    HTTP 401 : Un Auth


* POST /auth/register : User Register

> Params

    userid : User's ID [String]

    pw : User's Password [String]

    name : User's Name [String] (it change username to name)


> Response

    HTTP 200 : User

    HTTP 409 : already exists (it change 300 to 409)

    HTTP 500 : DB Error (it change 400 to 500)

* DElETE /auth/destroy (it change post to Delete)

> Params

    token : token [String]

> Response

    HTTP 200 : good bye

    HTTP 404 : not found (it change 401 to 404)
    
    HTTP 500 : DB ERROR (it change 409 to 500)
    
* GET /auth/fb/token 

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

* GET /word (change POST to GET)

> Response

    HTTP 200 : all word's

    HTTP 401 : Bad Request

* POST /word/find

> Params

    search : word search in word or similar word's [String]

> Response

    HTTP 200 : return word [String Json]

    HTTP 401 : No word Found

* GET /word/cata/:cata (change post /word/cata to GET /word/cata/:cata)

> Response

    HTTP 200 : return word [String Json]

    HTTP 401 : No word Found
 
    
* GET /word/:wordid (change POST /word/getwordInfo to GET /word/:wordid)

> Response

    HTTP 200 : return word Info [String Json]

    HTTP 401 : No word Found
    
* POST /word/comment (change commentadd to comment)

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


* GET /mydic/:token (change POST /mydic to GET /mydic/:token)

    > Response

        HTTP 200 : return mydic list [String array]

        HTTP 412 : send reason "already exists" or DB ERROR

* POST /mydic/make

> Params

    token: mydic owner token  [String]

    sub: mydic sub title [String]

    dicname: mydic name  [String]

> Response

    HTTP 200 : Success

    HTTP 500 : DB ERROR


* PUT /mydic/add (change post to put)

> Params

    token: mydic token  [String]

    dicname: mydic name  [String]

    word: add word name [String]

> Response

    HTTP 200 : return word list [String array]

    HTTP 412 : send reason "already exists" 

    HTTP 500 : DB ERROR

* PUT /mydic/pop (change post to put)

> Params

    token: mydic owner token  [String]

    dicname: mydic name  [String]

    wrod: pop word name [String]

> Response

    HTTP 200 : return word list [String array]

    HTTP 409 : send reason "already exists" or DB ERROR

* GET  /mydic/:token/:dicname (change post /mydic/detail/ to GET  /mydic/:token/:dicname)

> Params

    token: mydic token  [String]

    dicname: mydic name  [String]

> Response

    HTTP 200 : return word list [String array]

    HTTP 404 : not found

    HTTP 500 : DB ERROR


* GET /board (it change post to get)

> Response

    HTTP 200 : return board json


* POST /board/write


> Params

        file: if user upload image use key file

        token: writer token  [String]

        date: date  [String]

        title: title name [String]

        contents: contents [String]

> Response

        HTTP 200 : return Success

        HTTP 500 : send reason "already exists" or DB ERROR (it change 409 to 500)


* POST /board/comment (it change comment add to comment)

> Params

  token: writer token  [String]

  boardid: boardid [String]

  comment: board comment [String]

  date: write date [String]

> Response

    HTTP 200 : return Success

    HTTP 401 : not vaild token

    HTTP 500 : send reason "already exists" or DB ERROR
    
* GET /board/:boardid (it change post /board/detail to get /board/:boardid)

> Response

    HTTP 200 : return board detail

    HTTP 400 : not vaild id
    
* PUT /board/like

> Params

  boardid: boardid [String]

> Response

    HTTP 200 : return board 

    HTTP 400 : not vaild id
    
* PUT /board/dislike

> Params

  boardid: boardid [String]

> Response

    HTTP 200 : return board 

    HTTP 400 : not vaild id

* DELETE /board/destroy (change post to DELETE)

> Params

  boardid: boardid [String]

> Response

    HTTP 200 : goodbye

    HTTP 400 : not vaild id

    HTTP 401 : param not found

    HTPP 500 : DB ERR

* PUT /board/edit (chane post to put)

> Params

  boardid: boardid [String]
  
  title: title [String]
  
  contents: contents [String}
  
> Response

    HTTP 200 : changed

    HTTP 401 : not vaild board id

    HTTP 500 : DB ERR

* POST /quize

> Params

  nope

> Response

    HTTP 200 : return random word


* GET /my/:token (change post /my to GET /my/:token)

> Response

    HTTP 200: return user data
    
    HTTP 401: vaild token
    
    HTTP 500: DB ERROR (change 409 to 500)
    
* PUT /my/pointUp

> Params (change post to put)

  token: user token

  pointUp: pointUp

> Response

    HTTP 200: return user data
    
    HTTP 401: user not found

    HTTP 412: nothing change
    
    HTTP 500: DB ERROR
    
* GET /my/board (Chage post to get)

> Params

  token: user token

> Response

    HTTP 200: return writed board

    HTTP 401: vaild token

    HTTP 404: ever written
    
    HTTP 500: DB ERROR
    
* PUT /my/edit (change post to put)

> Params

  token: user token
  
  newName: new name
  
  file: profile image change
  
> Response

    HTTP 200: if u send just image then just change profile image if u send just newName tend just change name
    
    HTTP 500: DB ERROR
    
* GET /today

> Response

    HTTP 200: return today's word
    
    HTTP 401: user not found
    
    HTTP 409: DB ERROR
    
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

### Mydic
> owner: {type: String}

> dicname: {type: String}

> sub: {type: String}

> favorite: [String] // array

