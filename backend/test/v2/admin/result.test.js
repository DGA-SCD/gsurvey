const path = require('path');
global.appRoot = path.resolve(__dirname);
const appConf = require('../../../config/production.conf');
const mock = require("../../mock");
const resultApi = require("../../..//components/v2/admin/survey");

describe("save a resutl", () => {

    let req = mock.mockRequest({}, {
        surveyid: "1",
        resultid: "1",
        version: "1",
        userid: "24",
        result: {
            ans1: "aa",
            ans2: "bb"
        },
        created_at: new Date(),
        modified_at: new Date(),
    });

    let res = mock.mockResponse();

    test("save result", () => {
        return resultApi.saveResult(req, res)
            .then(b => {
                expect(b).toBe(true);
            });
    });
});

describe("search a result", () => {

    let req = mock.mockRequest({}, {});
    req.params = {
        resultId: '1'
    };

    let res = mock.mockResponse();

    test("get a result with id = 1", () => {
        return resultApi.getResultById(req, res)
            .then(b => {
                expect(b).toBe(true);
                const j = res.json();
                expect(j.data[0].resultid).toBe("1");
                expect(j.data[0].surveyid).toBe("1");
                expect(j.data[0].version).toBe("1");
                expect(j.data[0].userid).toBe("24");
                expect(j.data[0].result.ans1).toBe("aa");
                expect(j.data[0].result.ans2).toBe("bb");
            });
    });
});

describe("search all result by survey id = 1", () => {

    let req = mock.mockRequest({}, {});

    req.params = {
        surveyId: "1"
    };

    req.query = {
        uid: "24",
        v: "1",
        page: 1,
        per_page: 1
    };

    let res = mock.mockResponse();

    test("search all result by with surveyid = 1, userid = 1", () => {
        return resultApi.getAllResultsBySurveyId(req, res)
            .then(b => {
                expect(b).toBe(true);
                let r = res.json();
                console.log(r);
                expect(r.per_page).toBe(req.query.per_page);
                expect(r.page).toBe(req.query.page);
                expect(r.total !== 'undefined').toBe(true);
            });
    });

});