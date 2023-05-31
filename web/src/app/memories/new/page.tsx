import BackToTimeline from '@/components/BackToTimeline'
import NewMemoryForm from '@/components/NewMemoryForm'

export default function NewMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <BackToTimeline />

      <NewMemoryForm />
    </div>
  )
}
