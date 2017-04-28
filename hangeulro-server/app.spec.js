const app = require('./app');
const request = require('supertest')(app);
const should = require('should');

describe('GET / 는', ()=>{
  it("200을 응답한다", (done)=>{
    request
      .get('/')
      .expect(200)
      .end(done);
  });
});

describe('GET /word', ()=>{
  describe('성공시', ()=>{
      it("200과 word array를 반환한다", (done)=>{
        request
        .get('/word')
        .expect(200)
        .end((err, res)=>{
            res.should.be.json;
            res.body.should.be.instanceOf(Array);
            done();
        });
      });
  });
});
