export default async function getAuthHeaders(auth0) {
    const { isAuthenticated, user, getAccessTokenSilently } = auth0;

    if (!isAuthenticated) {
      return undefined;
    }

    const accessToken = await getAccessTokenSilently();

    return {
        Authorization: 'Bearer ' + accessToken,
        AuthSub: user.sub
    }
}