'use client'

import { api } from '@/lib/api'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import { EmptyMemories } from './EmptyMemories'
import MediaPicker from './MediaPicker'

interface Memory {
  id: string
  coverUrl?: string
  content: string
  isPublic: boolean
}

interface UpdateMemoryFormProps {
  token: string | undefined
}

export default function UpdateMemoryForm(props: UpdateMemoryFormProps) {
  const router = useRouter()
  const { id } = useParams()
  const [memory, setMemory] = useState<Memory>()
  const [coverUrl, setCoverUrl] = useState<string | undefined>('')
  const [isPublic, setIsPublic] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<File | undefined>(null)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await api.get<Memory>(`/memories/${id}`, {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        })

        const { coverUrl, isPublic, content } = response.data

        setCoverUrl(coverUrl)
        setIsPublic(isPublic)
        setContent(content)
        setMemory(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRecord()
  }, [])

  async function handleUpdateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let newCoverUrl = coverUrl

    if (fileToUpload instanceof File && fileToUpload.size > 0) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      newCoverUrl = uploadResponse.data.fileUrl
    }

    const data: Memory = { id, isPublic, content }

    try {
      await api.put(
        `/memories/${id}`,
        {
          content: data.content,
          isPublic: data.isPublic,
          coverUrl: newCoverUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      )

      router.push('/')
    } catch (error) {
      console.error('Erro ao atualizar o registro:', error)
    }
  }

  if (!memory) {
    return <EmptyMemories />
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedImage(file)
  }

  return (
    <form onSubmit={handleUpdateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Alterar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => {
              setIsPublic(e.target.checked)
            }}
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker />

      {coverUrl ? (
        <Image
          src={coverUrl}
          width={592}
          height={280}
          className="aspect-video w-full rounded-lg object-cover"
          alt=""
        />
      ) : (
        <p className="text-gray-500">Essa memória não contém mídia ainda :(</p>
      )}

      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar foto, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
