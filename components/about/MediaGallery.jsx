/**
 * Galerie médias — placeholders pour photos formation et vidéo.
 * Layout: 1 vidéo (mode large) + grille photos en dessous.
 */
export function MediaGallery({ photos = [], videoUrl }) {
  const fallbackPhotos =
    photos.length > 0
      ? photos
      : [
          { label: "Photo formation · à venir" },
          { label: "Atelier RLHF" },
          { label: "Photo formation · à venir" },
          { label: "Restitution équipe" },
        ];

  return (
    <div className="flex flex-col gap-6">
      {/* Vidéo principale */}
      <div className="relative aspect-video bg-surface border border-border rounded-lg overflow-hidden flex items-center justify-center">
        {videoUrl ? (
          <video
            controls
            className="w-full h-full object-cover"
            aria-label="Vidéo HID AI"
          >
            <source src={videoUrl} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
          </video>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 ml-0.5"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-strong">
              Vidéo · à venir
            </span>
          </div>
        )}
      </div>

      {/* Grille photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {fallbackPhotos.map((p, i) => (
          <div
            key={i}
            className="aspect-[4/3] bg-surface border border-border rounded-lg flex items-center justify-center p-4"
          >
            {p.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.src}
                alt={p.label}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-strong text-center leading-relaxed">
                {p.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
