export default function validateRegister(account) {
  console.log("name" + account.dep_id);

  let errors = {};

  if (!account.email) {
    errors.email = "กรุณาระบุอีเมล";
  } else if (!/\S+@\S+\.\S+/.test(account.email)) {
    account.email = "กรุณาใส่อีเมล์ให้ถูกต้อง";
  }
  if (!account.firstname) {
    errors.firstname = "กรุณากรอกชื่อด้วยค่ะ";
  }
  if (!account.password) {
    errors.password = "กรุณากรอกรหัสผ่าน";
  }
  if (!account.lastname) {
    errors.lastname = "กรุณากรอกนามสกุล";
  }
  if (!account.mobile) {
    errors.mobile = "กรุณาใส่เบอร์โทรศัพท์";
  } else if (!/^[0-9\b]+$/.test(account.mobile)) {
    errors.mobile = "กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง";
  }
  if (!account.min_id) {
    errors.min_id = "กรุณาเลือกกระทรวง";
  }
  if (!account.dep_id) {
    errors.dep_id = "กรุณาเลือกกรม";
  }
  if (!account.org_id) {
    errors.org_id = "กรุณาเลือกหน่วยงาน";
  }
  if (!account.check) {
    errors.check = "กรุณายอมรับข้อตกลงและเงื่อนไข";
  }

  return errors;
}
