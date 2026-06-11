import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { ListProjectsStatus } from "@workspace/api-zod";

export default function Projects() {
  const [status, setStatus] = useState<ListProjectsStatus | undefined>(undefined);
  const { data: projects, isLoading } = useListProjects({ status });
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Projects</h1>
        <p className="text-lg text-muted-foreground">
          Driving sustainable change through targeted initiatives across education, healthcare, and infrastructure.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <button onClick={() => setStatus(undefined)} className={`px-6 py-2 rounded-full border ${!status ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>All</button>
        <button onClick={() => setStatus('ongoing')} className={`px-6 py-2 rounded-full border ${status === 'ongoing' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>Ongoing</button>
        <button onClick={() => setStatus('completed')} className={`px-6 py-2 rounded-full border ${status === 'completed' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>Completed</button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : safeProjects.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No projects found for the selected filter.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeProjects.map((project, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={project.id} 
              className="bg-card border border-border group overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={project.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4 text-xs tracking-wider uppercase">
                  <span className="text-primary">{project.category}</span>
                  <span className="text-muted-foreground">{project.country}</span>
                </div>
                <h3 className="text-xl font-serif mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{project.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>${project.raisedAmount?.toLocaleString() ?? 0}</span>
                    <span className="text-muted-foreground">of ${project.goalAmount?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="h-1 w-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, ((project.raisedAmount ?? 0) / (project.goalAmount ?? 1)) * 100)}%` }} />
                  </div>
                </div>
                <Link href={`/projects/${project.id}`} className="block w-full text-center border border-primary text-primary py-3 hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-wider text-sm font-medium">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
