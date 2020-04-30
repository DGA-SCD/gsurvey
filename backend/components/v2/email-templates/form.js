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
"use strict";

// Example
// let body = `<p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">บัญชีผู้ใช้งานของท่านได้เปิดใช้งานเรียบร้อยแล้ว</p>
// <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">ท่านสามารถเข้าใช้งานได้ที่ ...</p>
// <br/>
// <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">
// <strong>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***</strong></p>
// <br/>
// <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">ขอแสดงความนับถือ</p>
// <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica; color:#333">ทีม G-Survey</p>`;
// let emailTemplate = new EmailTemplate(body);
// console.log(emailTemplate.getContent());

// let logo = `<img data-imagetype="External" src="${host}/static/images/logo" height="37" width="122" style="font-weight:bold; font-size:18px; color:#fff; vertical-align:top">`;

class EmailTemplate {
   constructor(body, logo) {
        this.logo = logo;
        this.body = body;
        this.bodyTemplate = `<div>
        <table cellspacing="0" cellpadding="0" border="0" style="color:#ffffff; background:#fff; padding:0; margin:0; width:100%; font:15px 'Helvetica Neue',Arial,Helvetica">
        <tbody>
        <tr width="100%">
        <td valign="top" align="left" style="background:#f0f0f0; font:15px 'Helvetica Neue',Arial,Helvetica">
        <table style="border:none; padding:0 18px; margin:50px auto; width:500px">
        <tbody>
        <tr width="100%" height="57">
        <td valign="top" align="left" style="background:#303f9f; background:linear-gradient(45deg,#303f9f,#7b1fa2); border-top-left-radius:4px; border-top-right-radius:4px; padding:12px 18px; text-align:center">
        <img data-imagetype="External" src="${this.logo}" height="37" width="122" style="font-weight:bold; font-size:18px; color:#fff; vertical-align:top">
        </td>
        </tr>
        <tr style="width:100%">
        <td valign="top" align="left" style="background:#fff; padding:30px">
        ${this.body}
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </div>`;
    }

    getContent() {
        return this.bodyTemplate;
    }
}

module.exports = {
    EmailTemplate
};