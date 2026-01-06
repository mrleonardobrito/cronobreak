export default defineNuxtRouteMiddleware(async (to) => {
  const userParam = to.params.user as string

  if (!userParam) {
    return  
  }

  const { session } = useUserSession()

  if (!session.value?.user) {
    return navigateTo('/')
  }

  const currentUserLogin = (session.value.user as any)?.login

  if (currentUserLogin !== userParam) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado: você não tem permissão para acessar este perfil'
    })
  }
})
