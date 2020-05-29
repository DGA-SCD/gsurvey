export default function validateRegister(account) {
  console.log("name" + account.dep_id);

  let errors = {};
  if (!account.email) {
    errors.email = "กรุณาระบุอีเมล";
  } else if (
    // !/^[A-Za-z0-9]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    !/^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+[.])+[a-z]{2,5}$/.test(account.email)
  ) {
    errors.email = "กรุณาใส่อีเมล์ให้ถูกต้อง";
  }
  if (!account.firstname) {
    errors.firstname = "กรุณากรอกชื่อด้วย";
  }
  if (!account.password) {
    errors.password = "กรุณากรอกรหัสผ่าน";
  } else if (account.password.length < 8) {
    errors.password = "ต้องมีความยาวมากกว่า 8 ตัวอักษรขึ้นไป";
  } else if (!/[A-Z]/.test(account.password)) {
    errors.password = "ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่ อย่างน้อย 1 ตัว";
  } else if (!/[0-9]/.test(account.password)) {
    errors.password = "ต้องมีตัวเลขอย่างน้อย 1 ตัว";
  } else if (!/^[A-Za-z0-9]+$/.test(account.password)) {
    errors.password = "ต้องเป็นตัวอักษรภาษาอังกฤษ และ ตัวเลขเท่านั้น";
  }

  if (!account.lastname) {
    errors.lastname = "กรุณากรอกนามสกุล";
  }
  if (!account.mobile) {
    errors.mobile = "กรุณาใส่เบอร์โทรศัพท์";
  } else if (!/^[0-9\b]+$/.test(account.mobile)) {
    errors.mobile = "กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง";
  } else if (account.mobile.length < 8) {
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
