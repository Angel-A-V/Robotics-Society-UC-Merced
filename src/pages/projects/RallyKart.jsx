// ── Rally Kart Page ────────────────────────────────────────────────────
// Route: /projects/rally-kart
// Content: data/projects/rally-kart.js
//
// This file only decides which sections appear and in what order. To change
// any wording, photo or timeline entry, edit the data file instead.

import Navbar from '../../components/layout/Navbar'
import ProjectHero from '../../components/project/ProjectHero'
import ProjectSection from '../../components/project/ProjectSection'
import Overview from '../../components/project/Overview'
import SystemsGrid from '../../components/project/SystemsGrid'
import Timeline from '../../components/project/Timeline'
import LeadsGrid from '../../components/project/LeadsGrid'
import BackToProjects from '../../components/project/BackToProjects'
import Slideshow from '../../components/ui/Slideshow'
import { HERO, OVERVIEW, GOAL, SYSTEMS, TIMELINE, LEADS, SLIDES } from '../../data/projects/rally-kart'

export default function RallyKart({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />
      <ProjectHero hero={HERO} />

      <div className="project-body">
        <ProjectSection title="Overview">
          <Overview paragraphs={OVERVIEW} goal={GOAL} />
        </ProjectSection>

        <ProjectSection title="Systems">
          <SystemsGrid systems={SYSTEMS} />
        </ProjectSection>

        <ProjectSection title="Development Timeline">
          <Timeline items={TIMELINE} />
        </ProjectSection>

        <ProjectSection title="Project Leads">
          <LeadsGrid leads={LEADS} />
        </ProjectSection>

        <ProjectSection title="Build Gallery">
          <Slideshow slides={SLIDES} label="Rally Kart photo gallery" />
        </ProjectSection>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackToProjects />
        </div>
      </div>
    </div>
  )
}
