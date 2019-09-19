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
module.exports.allbooking = () => { return [
    { title: 'ชื่อ-สกุล', field: 'fullname', type: 'string'},
    { title: 'ส่วนงาน', field: 'department', type: 'string'},
    { title: 'ฝ่าย', field: 'segment', type: 'string'},
    { title: 'เพื่อนร่วมห้อง', field: 'friend', type: 'string'},
    { title: 'ห้อง', field: 'room', type: 'string', lookup: {0: "ไม่ระบุ"}},
    { title: 'เดินทางโดย', field: 'vehicle', type: 'string'},
    { title: 'เดินทางโดย', field: 'vehicle', type: 'string', lookup: {0: "ไม่ระบุ", 1: "รถส่วนตัว", 2: "รถตู้", 3: "รถบัสคันที่ 1", 4: "รถบัสคันที่ 2", 5: "รถบัสคันที่ 3"}},
    { title: 'หมายเหตุ', field: 'remark', type: 'string'}
];}