import HeroTitleText from "@/components/HeroTitleText";
import NavBar from "@/components/NavBar";
import Navigation from "@/components/projects/Navigation";
import ProjectListItem from "@/components/projects/Projects";
import { listPublishedProjectsPublic } from "@/lib/projects";
import React from "react";

const Projects = async () => {
  const projects = await listPublishedProjectsPublic();

  return (
    <div>
      <NavBar />
      <Navigation
        projects={projects.map((p) => ({ name: p.title, href: `#${p.slug}` }))}
      />
      <HeroTitleText
        title="Our Projects"
        text="Our strength as an energy enabler lies in the unique blend of innovation, technical expertise, execution capability, and commercial insight we bring to every project. With a collaborative mindset and a global outlook, we continuously explore new possibilities in renewable energy, digital technologies, and sustainable business models. We are committed to being involved from concept to deployment, adding value at every stage. Each solution is intentionally designed to integrate with its social, environmental, cultural, and economic context delivering energy access with confidence, impact, and lasting relevance."
      />
      <div>
        {projects.map((p) => (
          <ProjectListItem key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
