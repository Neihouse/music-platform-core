import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

interface ArtistCardProps {
  id: string
  name: string
  profilePicture: string
  followers: number
  onFollow: () => void
}

export function ArtistCard({ id, name, profilePicture, followers, onFollow }: ArtistCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <Image
              src={profilePicture}
              alt={`Profile picture of ${name}`}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-500">{followers} followers</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onFollow}>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </Button>
      </CardFooter>
    </Card>
  )
}

