import { useGetProject } from "@workspace/api-client-react";
import { getGetProjectQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const enabled = Number.isFinite(projectId);
  const { data: project, isLoading } = useGetProject(projectId, {
    query: {
      enabled,
      queryKey: getGetProjectQueryKey(projectId),
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Project not found</div>;

  return (
    <div className="bg-background">
      <div className="relative h-[60vh] md:h-[70vh]">
        <img src={project.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'} alt={project.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs uppercase tracking-wider mb-4">{project.category}</span>
            <h1 className="text-4xl md:text-6xl font-serif max-w-4xl">{project.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-serif mb-6 text-primary">About the Project</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed">{project.description}</p>
              {/* More detailed content could go here based on API */}
            </div>
          </section>

          {(project.beforeImageUrl || project.afterImageUrl) && (
            <section className="grid grid-cols-2 gap-4">
              {project.beforeImageUrl && (
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Before</h3>
                  <img src={project.beforeImageUrl} alt="Before" className="w-full aspect-[4/3] object-cover" />
                </div>
              )}
              {project.afterImageUrl && (
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">After</h3>
                  <img src={project.afterImageUrl} alt="After" className="w-full aspect-[4/3] object-cover" />
                </div>
              )}
            </section>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-card border border-border p-8 sticky top-24">
            <h3 className="text-xl font-serif mb-6">Funding Progress</h3>
            <div className="space-y-2 mb-8">
              <div className="flex justify-between text-lg">
                <span className="font-bold text-primary">${project.raisedAmount?.toLocaleString() ?? 0}</span>
                <span className="text-muted-foreground">of ${project.goalAmount?.toLocaleString() ?? 0}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, ((project.raisedAmount ?? 0) / (project.goalAmount ?? 1)) * 100)}%` }} />
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Location</span>
                <span className="text-right">{project.location}, {project.country}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Status</span>
                <span className="text-right capitalize">{project.status}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Beneficiaries</span>
                <span className="text-right">{project.beneficiaries?.toLocaleString() ?? 'TBD'}</span>
              </div>
            </div>

            <Link href={`/donate?project=${project.id}`} className="block w-full bg-primary text-primary-foreground text-center py-4 uppercase tracking-wider font-semibold hover:bg-primary/90 transition-colors">
              Donate to this project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
