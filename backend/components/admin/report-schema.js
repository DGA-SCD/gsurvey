// MIT License

// Copyright 2019-present, Digital Government Development Agency (Public Organization) 

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * Use for generate header of datable
 */
module.exports.cost = () => { return [
    { title: 'รหัส', field: 'userId', type: 'string'},
    { title: 'ชื่อ-สกุล', field: 'fullname', type: 'string'},
    { title: 'ฝ่าย', field: 'department', type: 'string'},
    { title: 'ส่วนงาน', field: 'segment', type: 'string'},
    // { title: 'เพื่อนร่วมห้อง', field: 'friend', type: 'string'},
    // { title: 'ห้อง', field: 'room', type: 'string', },
    // { title: 'เดินทางโดย', field: 'vehicle', type: 'string'},
    // { title: 'หมายเหตุ', field: 'remark', type: 'string'}
    { title: 'เข้าร่วม', field: 'join', type: 'string'},
    { title: 'วันไป', field: 'checkinDate', type: 'numeric'},
    { title: 'วันกลับ', field: 'checkoutDate', type: 'numeric'},
    { title: 'เงื่อนไขของอาหาร', field: 'staffFood', type: 'string'},
    { title: 'ผู้รับผลประโยชน์', field: 'beneficiary', type: 'string'},
    { title: 'ความสัมพันธ์', field: 'relationship', type: 'string'},
    { title: 'เบอร์ติดต่อฉุกเฉิน', field: 'emergencyContractPhoneNumber', type: 'string'},
    { title: 'ผู้ติดตาม', field: 'follower', type: 'string'},
    { title: 'เลขบัตรประชาชน', field: 'followerCardID', type: 'string'},
    { title: 'ชื่อ-สกุล (ผู้ติดตาม)', field: 'followerFullName', type: 'string'},
    { title: 'วันที่ 1 มื้อเข้า', field: 'follwerMealD1_breakfast', type: 'numeric'},
    { title: 'วันที่ 1 มื้อกลางวัน', field: 'follwerMealD1_lunch', type: 'numeric'},
    { title: 'วันที่ 2 มื้อเข้า', field: 'follwerMealD2_breakfast', type: 'numeric'},
    { title: 'วันที่ 2 มื้อกลางวัน', field: 'follwerMealD2_lunch', type: 'numeric'},
    { title: 'วันที่ 3 มื้อกลางวัน', field: 'follwerMealD3_lunch', type: 'numeric'},
    { title: 'สมัคประกัน', field: 'followerApplyInsurance', type: 'string'},
    { title: 'ผู้รับผลประโยชน์', field: 'RelationOfBeneficiary', type: 'string'},
    { title: 'โรคประจำตัว', field: 'congenitalDisease', type: 'string'},

];}