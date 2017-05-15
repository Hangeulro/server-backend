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
