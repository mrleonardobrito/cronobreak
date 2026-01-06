import { eq } from 'drizzle-orm';

export async function validateUserAccess(event: H3Event, targetLogin: string) {
  const { user: currentUser } = await requireUserSession(event);

  if (currentUser.login !== targetLogin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado: você não tem permissão para acessar este recurso'
    });
  }

  const targetUser = await useDB()
    .select()
    .from(tables.users)
    .where(eq(tables.users.login, targetLogin))
    .limit(1)
    .get();

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuário não encontrado'
    });
  }

  return targetUser;
}

export async function validateHabitOwnership(event: H3Event, habitId: string) {
  const { user } = await requireUserSession(event);

  const habit = await useDB()
    .select()
    .from(tables.habits)
    .where(eq(tables.habits.id, habitId))
    .limit(1)
    .get();

  if (!habit) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Hábito não encontrado'
    });
  }

  if (habit.userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado: você não tem permissão para acessar este hábito'
    });
  }

  return habit;
}
