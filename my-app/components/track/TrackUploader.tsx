"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X } from 'lucide-react'

export function TrackUploader() {
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [coverArt, setCoverArt] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav']
    },
    maxFiles: 1
  })

  const onCoverArtDrop = useCallback((acceptedFiles: File[]) => {
    setCoverArt(acceptedFiles[0])
  }, [])

  const { getRootProps: getCoverArtRootProps, getInputProps: getCoverArtInputProps } = useDropzone({
    onDrop: onCoverArtDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  })

  const handleUpload = async () => {
    if (!file || !title || !genre) {
      setError('Please fill in all fields and upload a track file')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // Upload track file
      const trackFileName = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(trackFileName, file)

      if (uploadError) throw uploadError

      // Upload cover art if provided
      let coverArtUrl = null
      if (coverArt) {
        const coverArtFileName = `${user.id}/${Date.now()}-${coverArt.name}`
        const { error: coverArtUploadError } = await supabase.storage
          .from('cover-art')
          .upload(coverArtFileName, coverArt)

        if (coverArtUploadError) throw coverArtUploadError

        const { data: { publicUrl } } = supabase.storage
          .from('cover-art')
          .getPublicUrl(coverArtFileName)

        coverArtUrl = publicUrl
      }

      // Insert track data into the database
      const { error: insertError } = await supabase
        .from('tracks')
        .insert({
          title,
          genre,
          artist_id: user.id,
          file_path: trackFileName,
          cover_art_url: coverArtUrl
        })

      if (insertError) throw insertError

      setSuccess('Track uploaded successfully!')
      setTitle('')
      setGenre('')
      setFile(null)
      setCoverArt(null)
    } catch (error) {
      setError('Failed to upload track. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Track Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter track title"
        />
      </div>
      <div>
        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Enter genre"
        />
      </div>
      <div>
        <Label>Track File</Label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
            isDragActive ? 'border-primary' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-between">
              <span>{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p>Drag 'n' drop a track file here, or click to select a file</p>
          )}
        </div>
      </div>
      <div>
        <Label>Cover Art (optional)</Label>
        <div
          {...getCoverArtRootProps()}
          className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer"
        >
          <input {...getCoverArtInputProps()} />
          {coverArt ? (
            <div className="flex items-center justify-between">
              <span>{coverArt.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setCoverArt(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p>Drag 'n' drop cover art here, or click to select an image</p>
          )}
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleUpload} disabled={isUploading} className="w-full">
        {isUploading ? 'Uploading...' : (
          <>
            <Upload className="mr-2 h-4 w-4" /> Upload Track
          </>
        )}
      </Button>
    </div>
  )
}

