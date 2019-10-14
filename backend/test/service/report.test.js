const fs = require('fs')
const path = require('path')
const mock = require('../mock');
global.appRoot = path.resolve(__dirname);
const appConf = require('../..//config/production.conf');
const report = require('../../components/admin/report');

describe("Test report for billing",() => {
    const req = mock.mockRequest({},{});
    const res = mock.mockResponse();

    test("should be true if billing successfully", () => {
        return report.billing(req, res).then( status => {
            expect( status ).toBe( true );
        }).catch( err => expect(err).toBe());
    }, 10000)
})


describe("Test converting food conditions to string", ()=>{
    test("should be กินได้ทุกอย่าง,ฮาลาล,มังสวิรัติ,ไม่ทานเนื้อวัว", ()=>{
        var listofFC = report.foodConditionToString(['1','2','3','4']);
        expect(listofFC).toBe("กินได้ทุกอย่าง,ฮาลาล,มังสวิรัติ,ไม่ทานเนื้อวัว");
    })
    test("should be กินได้ทุกอย่าง", ()=>{
        var listofFC = report.foodConditionToString(['1']);
        expect(listofFC).toBe("กินได้ทุกอย่าง");
    })
    test("should be empty if input is undefined", ()=>{
        var listofFC = report.foodConditionToString();
        expect(listofFC).toBe("");
    })
    test("should be empty, if input is empty array", ()=>{
        var listofFC = report.foodConditionToString([]);
        expect(listofFC).toBe("");
    })
    test("should be empty, if input is empty array", ()=>{
        var listofFC = report.foodConditionToString(['5']);
        expect(listofFC).toBe("");
    })
})

describe("Test converting array of meal to string", ()=>{
    var c = {
        join: "ไป",
        checkinDate: 1,
        checkoutDate: 2,
        staffFood: "กินได้ทุกอย่าง",
        beneficiary: "someone",
        relationship: "แม่",
        emergencyContractPhoneNumber: "0931266505",
        follower: "ไม่มี",
        followerCardID: null,
        followerFullName: null,
        follwerMealD1_breakfast: 0,
        follwerMealD1_lunch: 0,
        follwerMealD2_breakfast: 0,
        follwerMealD2_lunch: 0,
        follwerMealD3_lunch: 0,
        followerApplyInsurance: null,
        followerBeneficiary: null,
        RelationOfBeneficiary: null,
        congenitalDisease: null
    };

    test("should be 1 for day 1 if an user want have breakfast", ()=>{
        const status = report.mealUpdate(c, ['1']);
        expect(status).toBe(true);
        expect(c.follwerMealD1_breakfast).toBe(1);
    });

    c = {
        join: "ไป",
        checkinDate: 1,
        checkoutDate: 2,
        staffFood: "กินได้ทุกอย่าง",
        beneficiary: "someone",
        relationship: "แม่",
        emergencyContractPhoneNumber: "0931266505",
        follower: "ไม่มี",
        followerCardID: null,
        followerFullName: null,
        follwerMealD1_breakfast: 0,
        follwerMealD1_lunch: 0,
        follwerMealD2_breakfast: 0,
        follwerMealD2_lunch: 0,
        follwerMealD3_lunch: 0,
        followerApplyInsurance: null,
        followerBeneficiary: null,
        RelationOfBeneficiary: null,
        congenitalDisease: null
    };
    test("should be 1 for all, if an user want all meal", ()=>{
        c = {
            join: "ไป",
            checkinDate: 1,
            checkoutDate: 2,
            staffFood: "กินได้ทุกอย่าง",
            beneficiary: "someone",
            relationship: "แม่",
            emergencyContractPhoneNumber: "0931266505",
            follower: "ไม่มี",
            followerCardID: null,
            followerFullName: null,
            follwerMealD1_breakfast: 0,
            follwerMealD1_lunch: 0,
            follwerMealD2_breakfast: 0,
            follwerMealD2_lunch: 0,
            follwerMealD3_lunch: 0,
            followerApplyInsurance: null,
            followerBeneficiary: null,
            RelationOfBeneficiary: null,
            congenitalDisease: null
        };
        const status = report.mealUpdate(c, ['1','2','3','4','5']);
        expect(status).toBe(true);
        expect(c.follwerMealD1_breakfast).toBe(1);
        expect(c.follwerMealD1_lunch).toBe(1);
        expect(c.follwerMealD2_breakfast).toBe(1);
        expect(c.follwerMealD2_lunch).toBe(1);
        expect(c.follwerMealD3_lunch).toBe(1);
    });

    test("should be true and must not update if an user want have breakfast", ()=>{
        c = {
            join: "ไป",
            checkinDate: 1,
            checkoutDate: 2,
            staffFood: "กินได้ทุกอย่าง",
            beneficiary: "someone",
            relationship: "แม่",
            emergencyContractPhoneNumber: "0931266505",
            follower: "ไม่มี",
            followerCardID: null,
            followerFullName: null,
            follwerMealD1_breakfast: 0,
            follwerMealD1_lunch: 0,
            follwerMealD2_breakfast: 0,
            follwerMealD2_lunch: 0,
            follwerMealD3_lunch: 0,
            followerApplyInsurance: null,
            followerBeneficiary: null,
            RelationOfBeneficiary: null,
            congenitalDisease: null
        };
        const status = report.mealUpdate(c);
        expect(status).toBe(true);
        expect(c.follwerMealD1_breakfast).toBe(0);
    })
})
