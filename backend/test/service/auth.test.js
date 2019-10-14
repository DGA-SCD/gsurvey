const fs = require('fs')
const path = require('path')
const mock = require('../mock');
global.appRoot = path.resolve(__dirname);
const appConf = require('../../config/production.conf');
const auth = require('../../components/auth/auth');


describe("test creating mysql connection", ()=>{
    const conn = auth.getConnection();
    test("should return conn is not null", ()=>{
        return conn.then(function(conn){
            expect(conn.state).toBe('authenticated');
            conn.end();
        })
        
    });


    test("should return user detail from querying", () => {
        const conn = auth.getConnection();
        return conn.then( (conn) => {
            return auth.getUserDetails( conn, '080481', '1234');
        }).then( (result) => {
            expect( result.UserID ).toBe( '080481' );
        }).catch( err => {
            console.error( err); 
            expect(err).toBe();
        })
    });
});

describe("test connect redis", () => {
    var redisConn;

    test("should return connection", ()=>{
        return auth.getRedisConnection().then( conn => {
            console.log( conn );
            redisConn = conn;
            expect( redisConn !== undefined ).toBe( true );
        }).catch( err => expect( err ).toBe() );
    });

    test("should return 'OK' if set value success", ()=>{
        return auth.redisSet(redisConn, 'test', 'test', 10).then( reply => {
            expect( reply ).toBe( 'OK' );
        }).catch( err => expect( err ).toBe() );
    });

    test("should return 'OK' if get value success", ()=>{
        return auth.redisGet(redisConn, 'test').then( reply => {
            expect( reply ).toBe( 'test' );
        }).catch( err => expect( err ).toBe() );
    });

});

describe("test login with promise", ()=> {
    test("should return 200, if login successful", () => {
        var req = mock.mockRequest( null, {
            userId: '080481',
            password: '1234'
        });
        var res = mock.mockResponse();
        res.cookie = jest.fn().mockReturnValue(res);
        return auth.login(req, res).then( status => {
            expect( status ).toBe( true );
        }).catch( err => expect( err ).toBe() );
    });
});