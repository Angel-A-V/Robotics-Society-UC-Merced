// ── BattleBots Page ────────────────────────────────────────────────────
// Route: /projects/battlebots
// Content: data/projects/battlebots.js
//
// This project is still waiting on details from its team, so only the hero
// and overview render. The Systems / Timeline / Leads sections below are
// already wired up — they appear automatically as soon as those arrays in
// the data file have entries in them.

import Navbar from '../../components/layout/Navbar'
import ProjectHero from '../../components/project/ProjectHero'
import ProjectSection from '../../components/project/ProjectSection'
import Overview from '../../components/project/Overview'
import SystemsGrid from '../../components/project/SystemsGrid'
import Timeline from '../../components/project/Timeline'
import LeadsGrid from '../../components/project/LeadsGrid'
import BackToProjects from '../../components/project/BackToProjects'
import { HERO, OVERVIEW, SYSTEMS, TIMELINE, LEADS } from '../../data/projects/battlebots'

export default function BattleBots({ user, handleLogout }) {
  return (
    <div className="page-project">
      <Navbar user={user} handleLogout={handleLogout} />
      <ProjectHero hero={HERO} />

      <div className="project-body">
        <ProjectSection title="Overview">
          <Overview paragraphs={OVERVIEW} />
        </ProjectSection>

        {/* These stay hidden while their data arrays are empty */}
        {SYSTEMS.length > 0 && (
          <ProjectSection title="Weight Classes">
            <SystemsGrid systems={SYSTEMS} />
          </ProjectSection>
        )}

        {TIMELINE.length > 0 && (
          <ProjectSection title="Build Timeline">
            <Timeline items={TIMELINE} />
          </ProjectSection>
        )}

        {LEADS.length > 0 && (
          <ProjectSection title="Team">
            <LeadsGrid leads={LEADS} />
          </ProjectSection>
        )}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackToProjects />
        </div>
      </div>
    </div>
  )
}
