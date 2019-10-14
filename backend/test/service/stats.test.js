const fs = require('fs')
const path = require('path')
const mock = require('../mock');
global.appRoot = path.resolve(__dirname);
const appConf = require('../..//config/production.conf');
const stats = require('../../components/admin/stats');


describe("Test stats query", () => {
    test("should be true if the number of done survey from MongoDB are more than one", () => {
        return stats.getNumberofCompleteSurveyFromMongoDB().then( (count) => {
            expect( count > 0 ).toBe(true);
        })
        .catch( err => expect(err).toBe());
    });

    test("should be true if the total staff are more than one", () => {
        return stats.getTotalStaff().then( (count) => {
            expect( count > 0 ).toBe(true);
        })
        .catch( err => expect(err).toBe());
    });

    test("should be true if the done survey are more than one", () => {
       return stats.getNumberofCompleteSurvey().then( (count) => {
            expect( count > 0 ).toBe(true);
       })
       .catch( err => expect(err).toBe()); 
    })

    test("should be 43 records of segements", () => {
        return stats.getDoneSurveyBySegment().then( (records) => {
            expect( records ).toBe(43);
        })
        .catch( err => expect(err).toBe());
    })

    test("should be 43 records of department", () => {
        return stats.getDoneSurveyByDepartment().then( (records) => {
            expect( records ).toBe(15);
        })
        .catch( err => expect(err).toBe());
    })
});


