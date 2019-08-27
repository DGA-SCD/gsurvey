const http = require("../../commons/http");

describe("test success function", () => {
    test('call success 200 with empty http response', () => {
        expect(http.success(null, {a: "b"})).toBe(null);
    });
});

describe("test http error function", () => {
    test('call error 404 not found ', ()=> {
        expect(http.error(null)).toBe(null);
    })
})