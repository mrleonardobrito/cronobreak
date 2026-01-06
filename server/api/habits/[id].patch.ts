import { eq } from 'drizzle-orm';
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod';
import { validateHabitOwnership } from '../../utils/auth';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  // Valida se o usuário é proprietário do hábito
  await validateHabitOwnership(event, id);

  const { title, description, completeDays, habitView } = await useValidatedBody(event, {
    title: z.string().optional(),
    description: z.string().optional(),
    completeDays: z.array(z.string()).optional(),
    habitView: z.boolean().optional(),
  });

  const updatedFields: Partial<{ title: string; description: string; completeDays: string[]; habitView: boolean }> = {};
  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (completeDays) updatedFields.completeDays = completeDays;
  if (habitView !== undefined) updatedFields.habitView = habitView;

  const habit = await useDB()
    .update(tables.habits)
    .set(updatedFields)
    .where(eq(tables.habits.id, id))
    .returning()
    .get();

  return habit;
});
