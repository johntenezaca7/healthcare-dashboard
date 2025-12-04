let sessionExpiredCallback: ((expired: boolean) => void) | null = null;

export function setSessionExpiredCallback(callback: (expired: boolean) => void) {
  sessionExpiredCallback = callback;
}

export function handleApiError(error: Error, response?: Response) {
  if (response?.status === 401 || error.message.includes('Unauthorized')) {
    if (sessionExpiredCallback) {
      sessionExpiredCallback(true);
    }
  }
}

export function checkResponseForAuthError(response: Response): boolean {
  if (response.status === 401) {
    if (sessionExpiredCallback) {
      sessionExpiredCallback(true);
    }
    return true;
  }
  return false;
}
