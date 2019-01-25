import {genSalt, hash} from 'bcryptjs';

/**
 * Service HashPassword using module 'bcryptjs'.
 * It takes in a plain password, generates a salt with given
 * round and returns the hashed password as a string
 */
export type HashPassword = (
  password: string,
  rounds: number,
) => Promise<string>;
// bind function to `services.bcryptjs.HashPassword`
export async function hashPassword(
  password: string,
  rounds: number,
): Promise<string> {
  const salt = await genSalt(rounds);
  return await hash(password, salt);
}
