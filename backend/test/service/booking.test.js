const path = require('path');
global.appRoot = path.resolve(__dirname);
const mock = require("../mock");
const booking = require("../../components/admin/booking");

describe("Test booking room", () => {
    var res = mock.mockRequest({},{});
    var req = mock.mockResponse();
    test("should return list of rooms", () => {
        return booking.getRooms(req, req).then(status => {
            expect(status[2] === "1101 Twin Bed (2)" && status[249] === "3716 Double Bed (2)").toBe(true);
        })
        .catch( err => expect(err).toBe());
    });
});