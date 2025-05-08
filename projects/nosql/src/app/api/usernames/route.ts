import User from '@/model/user'

export async function GET() {
  const users = await User.find({})
  const usernames = users.map(user => user.username)
  return new Response(JSON.stringify(usernames), {
    headers: { 'Content-Type': 'application/json' },
  })
}