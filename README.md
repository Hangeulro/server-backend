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

    password : User's   Password [String]

> Response

    HTTP 200 : User

    HTTP 401 : ID / Password Incorrect

* POST /auth/login/auto : Auto Login

> Params

    id : User's ID [String]

    apikey : if user use fb login or something else will return User's apikey [String] 

    token : if user use native login token will return token [String]

> Response

    HTTP 200 : Success

    HTTP 401 : Access Denied


* POST /auth/register : User Register

> Params

    userid : User's ID [String]

    password : User's Password [String]

    username : User's Name [String]


> Response

    HTTP 200 : User
    
    HTTP 300 : already exists

    HTTP 401 : Bad Request

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


## Database Schema

### User

> id : User's id [String required unique]

> pw : User's Password [String required]

> username : User Name [String required]

> apikey : User's ApiKey [String]

> mydic : User's Custom dictionary [Array]
>>> dicname: dictionary list [String]
>>> favorite: contents list (word's id list) [number Array] 

>> Array Contains ONLY food's id
  
> exception: 

>> religion : User's Religion Exception Code [Number Array]
    
>> allergy : User's Allergic Exception Code [Number Array]
    
>> custom : User's Custom Exception [String Array]


### Word

> id: word's ID [Number]

> word : this Word [String]

> mean : Word's mean [String]

> ex : Word's example [String]

> similar : similar Word [String Array]

> cata : category [String Array]

> tag : tag of Word [String Array]

