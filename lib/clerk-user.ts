import { currentUser } from '@clerk/nextjs/server'

export default async function getUser() {
    const user = await currentUser()
    return user
}