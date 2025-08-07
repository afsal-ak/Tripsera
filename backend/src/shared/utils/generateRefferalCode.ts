import { UserModel } from '@infrastructure/models/User';
export async function generateUniqueReferralCode(): Promise<string> {
  let code: string = '';
  let isUnique = false;

  while (!isUnique) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingUser = await UserModel.findOne({ referralCode: code });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return code;
}
