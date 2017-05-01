const app = require('../app');
const request = require('supertest')(app);
const should = require('should');

describe('GET /word', ()=>{
  describe('성공시', ()=>{
    it("200과 word array를 반환한다", (done)=>{
        request.get('/word').expect(200).end((err, res)=>{
            res.should.be.json;
            res.body.should.be.instanceOf(Array);
            done();
          });
      });
  });
});

describe('POST /word/find는', ()=>{
  describe('성공시', (done)=>{
    it("200과 JSON 배열 보넴", (done)=>{
      request.post('/word/find').send({search:'일'}).expect(200).end((err, res)=>{
          res.should.be.json;
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
  });

  describe('실패시', (done)=>{
    it("404를보넴", (done)=>{
      request.post('/word/find').send({search:'ㅁㄴㅇㄻㄴㅇ'}).expect(404).end(done);
    });
  });
});

describe('GET /cata/{cata}는', ()=>{
  describe('성공시', (done)=>{
    it("200과 JSON 배열 보넴", (done)=>{
      request.get('/cata/일').expect(200).end((err, res)=>{
          res.should.be.json;
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
  });

  describe('실패시', (done)=>{
    it("404를보넴", (done)=>{
      request.get('/cata/느').send({search:'ㅁㄴㅇㄻㄴㅇ'}).expect(404).end(done);
    });
  });
});

describe('POST /word/{wordid}는', ()=>{
  describe('성공시', (done)=>{
    it("200과 JSON 배열 보넴", (done)=>{
      request.post('/word/find').send({search:'일'}).expect(200).end((err, res)=>{
          res.should.be.json;
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
  });

  describe('실패시', (done)=>{
    it("404를보넴", (done)=>{
      request.post('/word/find').send({search:'ㅁㄴㅇㄻㄴㅇ'}).expect(404).end(done);
    });
  });
});
