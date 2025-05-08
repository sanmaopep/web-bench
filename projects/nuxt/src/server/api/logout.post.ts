export default defineEventHandler(async (event) => {
  deleteCookie(event, 'TOKEN');
  return { success: true };
});