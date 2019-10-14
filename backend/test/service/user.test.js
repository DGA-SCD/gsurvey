const fs = require('fs')
const path = require('path')
global.appRoot = path.resolve(__dirname);
const mock = require('../mock');
const user = require("../../components/users/user");

describe('test query all booking', ()=>{
    const req = mock.mockRequest({},{});
    const res = mock.mockResponse();
    test('should return 200 ok', () =>{
        user.getAllBooking(req, res)
        .then( (res) => {
            expect(res).toBe(true);
        })
        .catch( err => {
            console.log( err );
            expect( err ).toBe();
        });
    });
});


describe('test set room and vehicle', ()=>{
    const req = mock.mockRequest({},{
        room: 1,
        vehicle: 1,
        remark: "-ไม่ระบุ-"
    });
    req.USERID = '080481';
    const res = mock.mockResponse();
    test('should return 200 ok', () =>{
        user.setRoomAndVehicle(req, res)
        .then( (res) => {
            expect(res).toBe(true);
        })
        .catch( err => {
            console.log( err );
            expect( err ).toBe();
        });
    });
});