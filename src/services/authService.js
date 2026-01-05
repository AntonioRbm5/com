export const authService = {
  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
};
