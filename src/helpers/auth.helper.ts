import * as crypto from "crypto";

export const generateId = () => {
  const random = crypto.randomBytes(20).toString("hex");
  return random;
}

type hashPasswordReturn = {
  hash: string;
  salt?: string;
}
export const hashPassword = (password: string, randomSalt: boolean = true, salt?: string): Promise<hashPasswordReturn> => {
  return new Promise((resolve, reject) => {
    if (randomSalt) {
      salt = crypto.randomBytes(16).toString("hex");
    }

    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, hash) => {
      if (err) return reject(err);
      resolve({
        hash: hash.toString("hex"), 
        salt
      })
    })
  })
}

export const validatePassword = (password: string, hash:string, salt: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, _hash) => {
      if (err) return reject(err);
      resolve((_hash.toString("hex") === hash));
    })
  })
}

export const generateSession = () => {
  return crypto.randomBytes(32).toString("hex");
}