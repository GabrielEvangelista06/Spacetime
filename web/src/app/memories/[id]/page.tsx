import BackToTimeline from '@/components/BackToTimeline'
import { EmptyMemories } from '@/components/EmptyMemories'
import UpdateMemoryForm from '@/components/UpdateMemoryForm'
import { cookies } from 'next/headers'

export default async function ShowMemory() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <BackToTimeline />

      <UpdateMemoryForm token={token} />
    </div>
  )
}
