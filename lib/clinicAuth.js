import crypto from "crypto";

const SECRET = process.env.ADMIN_SECRET;

function sign(clinicId) {
  return crypto.createHmac("sha256", SECRET).update(clinicId).digest("hex");
}

export function makeClinicSessionValue(clinicId) {
  return `${clinicId}.${sign(clinicId)}`;
}

export function verifyClinicSession(value) {
  if (!value) return null;
  const [id, sig] = value.split(".");
  if (!id || !sig) return null;
  if (sig !== sign(id)) return null;
  return id;
}