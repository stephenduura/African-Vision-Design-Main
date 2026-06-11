import { useGetEvent } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Newspaper, Radio, CalendarDays, Play, ExternalLink } from "lucide-react";

const typeMeta = {
  update: { label: "Field Update", icon: Radio },
  press: { label: "In the Press", icon: Newspaper },
  event: { label: "Event", icon: CalendarDays },
  video: { label: "Watch", icon: Play },
} as const;

function safeDate(d: string) {
  const parsed = new Date(d);
  return Number.isNaN(parsed.getTime()) ? d : format(parsed, "MMMM d, yyyy");
}

function HeroImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary" role="img" aria-label={alt}>
        <div className="flex flex-col items-center gap-3 text-primary/80">
          <Newspaper size={40} strokeWidth={1.1} />
          <span className="font-serif text-lg tracking-wide">Papi Foundation</span>
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className="w-full h-full object-cover opacity-80" />;
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useGetEvent(Number(id));

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-5">
          <div className="mx-auto w-14 h-14 border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Newspaper size={24} className="text-primary" />
          </div>
          <h1 className="font-serif text-3xl text-foreground">Story not found</h1>
          <p className="text-muted-foreground leading-relaxed">This story may have moved. Browse the newsroom for the latest updates.</p>
          <Link href="/news" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
            Back to Newsroom <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );

  const meta = typeMeta[event.type];
  const paragraphs = (event.content ?? event.description).split("\n");

  return (
    <article className="bg-background pb-32">
      <div className="relative h-[55vh] md:h-[65vh]">
        <HeroImage src={event.imageUrl} alt={event.title} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,38,28,0.25) 0%, rgba(15,38,28,0.05) 30%, var(--background) 100%)" }} />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto bg-card border border-border p-8 md:p-16">
          <Link href="/news" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News &amp; Events
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-wider mb-6">
            <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
              <meta.icon size={13} /> {meta.label}
            </span>
            <span className="text-muted-foreground">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Calendar size={13} className="text-primary" /> {safeDate(event.date)}
            </span>
            <span className="text-muted-foreground">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={13} className="text-primary" /> {event.location}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8 leading-tight">{event.title}</h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-10 pb-10 border-b border-border/50">{event.description}</p>

          {event.videoUrl && (
            <a
              href={event.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mb-10 bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors"
            >
              <Play size={14} /> Watch the Video <ExternalLink size={13} />
            </a>
          )}

          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary text-foreground/90 space-y-6 leading-relaxed">
            {paragraphs.map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ) : null,
            )}
          </div>

          <div className="mt-14 pt-10 border-t border-border/50">
            <Link href="/news" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-primary hover:gap-3 transition-all">
              <ArrowLeft size={13} /> More from the Newsroom
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
