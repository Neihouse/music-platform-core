// Generic upload components
export { AvatarUpload } from "./AvatarUpload";
export type { AvatarUploadConfig, IAvatarUploadProps } from "./AvatarUpload";

export { BannerUpload } from "./BannerUpload";
export type { BannerUploadConfig, IBannerUploadProps } from "./BannerUpload";

export { PosterUpload } from "./PosterUpload";
export type { IPosterUploadProps, PosterUploadConfig } from "./PosterUpload";

// Entity-specific avatar uploads
export { ArtistAvatarUpload } from "./ArtistArtUpload/ArtistAvatarUpload";
export type { IArtistAvatarUploadProps } from "./ArtistArtUpload/ArtistAvatarUpload";

export { PromoterAvatarUpload } from "./PromoterAvatarUpload";
export type { IPromoterAvatarUploadProps } from "./PromoterAvatarUpload";

// Entity-specific banner uploads
export { ArtistBannerUpload } from "./ArtistArtUpload/ArtistBannerUpload";
export { PromoterBannerUpload } from "./PromoterBannerUpload";
export type { IPromoterBannerUploadProps } from "./PromoterBannerUpload";

// Entity-specific poster uploads
export { EventPosterUpload } from "./PosterUpload/EventPosterUpload";
export type { IEventPosterUploadProps } from "./PosterUpload/EventPosterUpload";

