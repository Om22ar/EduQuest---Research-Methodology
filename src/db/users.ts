import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  const result = await db.insert(users)
    .values({
      uid,
      email,
      name: name || null,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        name: name || null,
      },
    })
    .returning();

  return result[0];
}
