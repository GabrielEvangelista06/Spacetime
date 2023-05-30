import { ChangeEvent } from 'react'

interface MediaPickerProps {
  onFileSelected: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function MediaPicker({ onFileSelected }: MediaPickerProps) {
  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="coverUrl"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />
    </>
  )
}
