import { Connection, PublicKey } from '@solana/web3.js'

import {
  MetaplexNFT,
  MetaplexNFTPropertiesFile,
  SolanaNFT,
  SolanaNFTType,
} from './types'
import { Nullable } from '../utils/typeUtils'
import { Collectible, CollectibleMediaType } from '../utils/types'
import * as borsh from 'borsh';
import { Metadata, METADATA_SCHEMA } from '../schema';

type SolanaNFTMedia = {
  collectibleMediaType: CollectibleMediaType
  url: string
  frameUrl: Nullable<string>
}

const METADATA_PROGRAM_ID_PUBLIC_KEY = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

const METADATA_REPLACE = new RegExp('\u0000', 'g');
/**
 * NFT is a gif if it has a file with MIME type image/gif
 * if it's a gif, we compute an image frame from the gif
 */
const nftGif = async (nft: MetaplexNFT): Promise<Nullable<SolanaNFTMedia>> => {
  const gifFile = (nft.properties?.files ?? []).find(
    (file: any) => typeof file === 'object' && file.type === 'image/gif'
  )
  if (gifFile) {
    const url = (gifFile as MetaplexNFTPropertiesFile).uri
    return {
      collectibleMediaType: 'GIF',
      url,
      frameUrl: null
    }
  }
  return null
}

/**
 * NFT is a 3D object if:
 * - its category is vr, or
 * - it has an animation url that ends in glb, or
 * - it has a file whose type is glb, or
 *
 * if the 3D has a poster/thumbnail, it would be:
 * - either in the image property, or
 * - the properties files with a type of image
 */
const nftThreeDWithFrame = async (
  nft: MetaplexNFT
): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? []
  const objFile = files.find(
    (file: any) => typeof file === 'object' && file.type.includes('glb')
  ) as MetaplexNFTPropertiesFile
  const objUrl = files.find(
    (file: any) => typeof file === 'string' && file.endsWith('glb')
  ) as string
  const is3DObject =
    nft.properties?.category === 'vr' ||
    nft.animation_url?.endsWith('glb') ||
    objFile ||
    objUrl
  if (is3DObject) {
    let frameUrl
    if (!nft.image.endsWith('glb')) {
      frameUrl = nft.image
    } else {
      const imageFile = files?.find(
        (file: any) => typeof file === 'object' && file.type.includes('image')
      ) as MetaplexNFTPropertiesFile
      if (imageFile) {
        frameUrl = imageFile.uri
      }
    }
    if (frameUrl) {
      let url: string
      if (nft.animation_url && nft.animation_url.endsWith('glb')) {
        url = nft.animation_url
      } else if (objFile) {
        url = objFile.uri
      } else if (objUrl) {
        url = objUrl
      } else {
        return null
      }
      return {
        collectibleMediaType: 'THREE_D',
        url,
        frameUrl
      }
    }
  }
  return null
}

/**
 * NFT is a video if:
 * - its category is video, or
 * - it has an animation url that does not end in glb, or
 * - it has a file whose type is video, or
 * - it has a file whose url includes watch.videodelivery.net
 *
 * if the video has a poster/thumbnail, it would be in the image property
 * otherwise, we later use the first video frame as the thumbnail
 */
const nftVideo = async (
  nft: MetaplexNFT
): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? []
  // In case we want to restrict to specific file extensions, see below link
  // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/views/artCreate/index.tsx#L318
  const videoFile = files.find(
    (file: any) =>
      typeof file === 'object' &&
      file.type.includes('video') &&
      !file.type.endsWith('glb')
  ) as MetaplexNFTPropertiesFile
  const videoUrl = files.find(
    (file: any) =>
      typeof file === 'string' &&
      // https://github.com/metaplex-foundation/metaplex/blob/397ceff70b3524aa0543540584c7200c79b198a0/js/packages/web/src/components/ArtContent/index.tsx#L107
      file.startsWith('https://watch.videodelivery.net/')
  ) as string
  const isVideo =
    nft.properties?.category === 'video' ||
    (nft.animation_url && !nft.animation_url.endsWith('glb')) ||
    videoFile ||
    videoUrl
  if (isVideo) {
    let url: string
    if (nft.animation_url && !nft.animation_url.endsWith('glb')) {
      url = nft.animation_url
    } else if (videoFile) {
      url = videoFile.uri
    } else if (videoUrl) {
      url = videoUrl
    } else if (files.length) {
      // if there is only one file, then that's the video
      // otherwise, the second file is the video (the other files are image/audio files)
      // https://github.com/metaplex-foundation/metaplex/blob/397ceff70b3524aa0543540584c7200c79b198a0/js/packages/web/src/components/ArtContent/index.tsx#L103
      if (files.length === 1) {
        url = typeof files[0] === 'object' ? files[0].uri : files[0]
      } else {
        url = typeof files[1] === 'object' ? files[1].uri : files[1]
      }
    } else {
      return null
    }
    return {
      collectibleMediaType: 'VIDEO',
      url,
      frameUrl: nft.image || null
    }
  }
  return null
}

/**
 * NFT is an image if:
 * - its category is image, or
 * - it has a file whose type is image, or
 * - it has an image property
 */
const nftImage = async (
  nft: MetaplexNFT
): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? []
  // In case we want to restrict to specific file extensions, see below link
  // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/views/artCreate/index.tsx#L316
  const imageFile = files.find(
    (file: any) => typeof file === 'object' && file.type.includes('image')
  ) as MetaplexNFTPropertiesFile
  const isImage =
    nft.properties?.category === 'image' || nft.image.length || imageFile
  if (isImage) {
    let url
    if (nft.image.length) {
      url = nft.image
    } else if (imageFile) {
      url = imageFile.uri
    } else if (files.length) {
      if (files.length === 1) {
        url = typeof files[0] === 'object' ? files[0].uri : files[0]
      } else {
        url = typeof files[1] === 'object' ? files[1].uri : files[1]
      }
    } else {
      return null
    }
    return {
      collectibleMediaType: 'IMAGE',
      url,
      frameUrl: url
    }
  }
  return null
}

/**
 * If not easily discoverable tha nft is gif/video/image, we check whether it has files
 * if it does not, then we discard the nft
 * otherwise, we fetch the content type of the first file and check its MIME type:
 * - if gif, we also compute an image frame from it
 * - if video, we later use the first video frame as the thumbnail
 * - if image, the image url is also the frame url
 */
const nftComputedMedia = async (
  nft: MetaplexNFT
): Promise<Nullable<SolanaNFTMedia>> => {
  const files = nft.properties?.files ?? []
  if (!files.length) {
    return null
  }

  const url = typeof files[0] === 'object' ? files[0].uri : files[0]
  const headResponse = await fetch(url, { method: 'HEAD' })
  const contentType = headResponse.headers.get('Content-Type')
  if (contentType?.includes('gif')) {
    // frame url for the gif is computed later in the collectibles page
    return {
      collectibleMediaType: 'GIF',
      url,
      frameUrl: null
    }
  }
  if (contentType?.includes('video')) {
    return {
      collectibleMediaType: 'VIDEO',
      url,
      frameUrl: null
    }
  }
  if (contentType?.includes('image')) {
    return {
      collectibleMediaType: 'IMAGE',
      url,
      frameUrl: url
    }
  }

  return null
}

const metaplexNFTToCollectible = async (
  nft: MetaplexNFT,
  address: string
): Promise<Collectible> => {
  const identifier = [nft.symbol, nft.name, nft.image]
    .filter(Boolean)
    .join(':::')


  const collectible = {
    id: identifier,
    tokenId: identifier,
    name: nft.name,
    description: nft.description,
    externalLink: nft.external_url,
    isOwned: true,
    chain: 'sol',
    creators: nft.properties?.creators,
    attributes: nft.attributes
  } as unknown as Collectible


  if (
    (nft.properties?.creators ?? []).some(
      (creator: any) => creator.address === address
    )
  ) {
    collectible.isOwned = false
  }

  const { url, frameUrl, collectibleMediaType } = ((await nftGif(nft)) ||
    (await nftThreeDWithFrame(nft)) ||
    (await nftVideo(nft)) ||
    (await nftImage(nft)) ||
    (await nftComputedMedia(nft))) as SolanaNFTMedia
  collectible.frameUrl = frameUrl
  collectible.mediaType = collectibleMediaType
  if (collectibleMediaType === 'GIF') {
    collectible.gifUrl = url
  } else if (collectibleMediaType === 'THREE_D') {
    collectible.threeDUrl = url
  } else if (collectibleMediaType === 'VIDEO') {
    collectible.videoUrl = url
  } else if (collectibleMediaType === 'IMAGE') {
    collectible.imageUrl = url
  }

  return collectible
}

export const solanaNFTToCollectible = async (
  nft: SolanaNFT,
  address: string,
  type: SolanaNFTType
): Promise<Nullable<Collectible>> => {
  return metaplexNFTToCollectible(nft as MetaplexNFT, address)
}


export const getNftMetadata = async (uri: string) => {

  const result =
    await fetch(uri)
      .then(res => res.json())
      .catch(() => null)

  return result;
}

export async function decodeMetadata(buffer: Buffer) {
  const metadata = borsh.deserializeUnchecked(
    METADATA_SCHEMA,
    Metadata,
    buffer,
  );
  metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, '');
  metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, '');
  metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, '');
  return metadata;
}

export async function getNftMetaDataByMint(mintAddress: string) {
  const web3 = require('@solana/web3.js');

  let connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );
  // const { connection } = useConnection();

  const program = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID_PUBLIC_KEY.toBytes(),
      new PublicKey(mintAddress).toBytes()
    ],
    METADATA_PROGRAM_ID_PUBLIC_KEY
  )

  let accountInfo = await connection.getAccountInfo(program[0])
  let metadata = await decodeMetadata(accountInfo.data)

  const result =
    await fetch(metadata.data.uri)
      .then(res => res.json())
      .catch(() => null)

  return { ...metadata, ...result };
}