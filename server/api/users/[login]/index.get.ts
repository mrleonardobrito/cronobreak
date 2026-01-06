import { useValidatedParams, z } from 'h3-zod';
import { validateUserAccess } from '../../../utils/auth';

export default eventHandler(async event => {
  const { login } = await useValidatedParams(event, {
    login: z.string().toLowerCase(),
  });

  // Valida se o usuário tem acesso ao perfil solicitado
  const user = await validateUserAccess(event, login);

  return user;
});
