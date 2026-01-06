import { eq } from 'drizzle-orm';
import { useValidatedParams, zh } from 'h3-zod';
import { validateHabitOwnership } from '../../utils/auth';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  await validateHabitOwnership(event, id.toString());

  const deletedHabit = await useDB()
    .delete(tables.habits)
    .where(eq(tables.habits.id, id))
    .returning()
    .get();

  return deletedHabit;
});
