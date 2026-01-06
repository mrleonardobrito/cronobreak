import { eq, and } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';
import { validateUserAccess } from '../../../utils/auth';

export default eventHandler(async event => {
  const { login } = await useValidatedParams(event, {
    login: z.string().toLowerCase(),
  });

  const user = await validateUserAccess(event, login);

  if (!user.userView) {
    return [];
  }

  const habits = await useDB()
    .select()
    .from(tables.habits)
    .where(and(eq(tables.habits.userId, user.id), eq(tables.habits.habitView, true)))
    .all();

  return habits;
});
