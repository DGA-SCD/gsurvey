const path = require('path');
global.appRoot = path.resolve(__dirname);
const appConf = require('../../../config/production.conf');
const mock = require("../../mock");
const surveyApi = require("../../..//components/v2/admin/survey");


describe("create survey", () => {

    let req = mock.mockRequest({}, {
        userid: "24",
        surveyid: "1",
        version: "1",
        name: "test",
        password: "1234",
        pages: {
            test: "aa",
            test2: "bb",
        },
        created_at: new Date(),
        modified_at: new Date(),
    });

    let res = mock.mockResponse();

    test("create survey", () => {
        return surveyApi.createEmptySurvey(req, res)
            .then(b => {
                expect(b).toBe(true);
            });
    });
});

describe("save survey", () => {

    let req = mock.mockRequest({}, {
        userid: "24",
        surveyid: "1",
        version: "1",
        name: "test",
        password: "1234",
        pages: {
            test: "xx",
            test2: "bdc",
        }
    });

    let res = mock.mockResponse();

    test("save survey with password", () => {
        return surveyApi.saveSurvey(req, res)
            .then(b => {
                expect(b).toBe(true);
            });
    });
});

describe("search survey", () => {
    let req = mock.mockRequest({}, {});
    req.signedCookies = [];
    req.signedCookies['userid'] = "24";
    req.params = {
        ownerid: "24"
    }

    req.query = {
        page: 1,
        per_page: 1
    }

    let res = mock.mockResponse();

    test("search survey by owner Id", () => {
        return surveyApi.getAllSurveysByOwnerId(req, res)
            .then(b => {
                expect(b).toBe(true);
                let r = res.json();
                expect(r.per_page).toBe(req.query.per_page);
                expect(r.page).toBe(req.query.page);
                expect(r.total !== 'undefined').toBe(true);
            });
    });

});

describe("search a survey", () => {
    let req = mock.mockRequest({}, {});
    req.params = {
        surveyId: "1"
    };

    req.query = {
        uid: "24",
        v: "1"
    };

    let res = mock.mockResponse();

    test("search survey by surveyid = 1", () => {
        return surveyApi.getSurveyById(req, res)
            .then(b => {
                expect(b).toBe(true);
                let r = res.json();
                console.log(r);
                const d = r.data;
                expect(d.surveyid).toBe(req.params.surveyId);
                expect(d.version).toBe(req.query.v);
                expect(d.userid).toBe(req.query.uid);
                expect(d.name).toBe("test");
                expect(d.pages.test).toBe("xx");
                expect(d.pages.test2).toBe("bdc");
            });
    });

});

describe("rename a survey", () => {
    let req = mock.mockRequest({}, {});
    req.signedCookies = [];
    req.signedCookies['userid'] = "24";

    req.body.surveyid = '1';
    req.body.version = '1';
    req.body.name = "test";
    
    let res = mock.mockResponse();

    test("rename a survey with surveyid = 1", () => {
        return surveyApi.renameSurvey(req, res)
            .then(b => {
                expect(b).toBe(true);
                let r = res.json();
                console.log(r);
                const d = r.data;
                expect(d.affected).toBe(1);
            });
    });

});

describe("view password", () => {

    test("should display passord as '1234' for survey id = 1", () => {
        let req = mock.mockRequest({}, {});
        req.signedCookies = [];
        req.signedCookies['userid'] = "24";
        req.query = {
            sid: '1',
            v: '1'
        };
        
        let res = mock.mockResponse();
        return surveyApi.viewPassword(req, res).then(response => {
            expect(response).toBe(true);
            const data = res.json().data;
            expect(data.surveyid).toBe('1');
            expect(data.password).toBe('1234');
        });
        
    })

    test("should display passord as '1234' with undefined version", () => {
        let req = mock.mockRequest({}, {});
        req.signedCookies = [];
        req.signedCookies['userid'] = "24";
        req.query = {
            sid: '1'
        };
        
        let res = mock.mockResponse();
        return surveyApi.viewPassword(req, res).then(response => {
            expect(response).toBe(true);
            const data = res.json().data;
            expect(data.surveyid).toBe('1');
            expect(data.password).toBe('1234');
        });
        
    })


    
    test("should alert return code 40000", () => {
        let req = mock.mockRequest({}, {});
        req.signedCookies = [];
        req.signedCookies['userid'] = "24";
        req.query = {
        };
        
        let res = mock.mockResponse();
        return surveyApi.viewPassword(req, res).then(response => {
            expect(response).toBe(false);
            const data = res.json();
            expect(data.success).toBe(false);
            expect(data.code).toBe(40000);
        });
        
    })
})











describe("remove a survey", () => {
    let req = mock.mockRequest({}, {});
    req.signedCookies = [];
    req.signedCookies['userid'] = "24";

    req.body.surveyid = '1';
    req.body.version = '1';
    
    let res = mock.mockResponse();

    test("remove a survey with surveyid = 1", () => {
        return surveyApi.deleteSurvey(req, res)
            .then(b => {
                expect(b).toBe(true);
                let r = res.json();
                console.log(r);
                const d = r.data;
                expect(d.affected).toBe(1);
            });
    });

});
