// ── Robot Arm Page ─────────────────────────────────────────────────────
// Route: /projects/robot-arm
// Content: data/projects/robot-arm.js
//
// No build gallery yet, so the Demo section shows the DemoPending
// placeholder. Swap it for a <Slideshow> once there are photos.

import Navbar from '../../components/layout/Navbar'
import ProjectHero from '../../components/project/ProjectHero'
import ProjectSection from '../../components/project/ProjectSection'
import Overview from '../../components/project/Overview'
import SystemsGrid from '../../components/project/SystemsGrid'
import TimelineRail from '../../components/project/TimelineRail'
import LeadsGrid from '../../components/project/LeadsGrid'
import DemoPending from '../../components/project/DemoPending'
import BackToProjects from '../../components/project/BackToProjects'
import { HERO, OVERVIEW, GOAL, SYSTEMS, TIMELINE, LEADS } from '../../data/projects/robot-arm'

export default function RobotArm({ user, handleLogout }) {
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
          <TimelineRail items={TIMELINE} accent={HERO.accent} />
        </ProjectSection>

        <ProjectSection title="Project Lead">
          <LeadsGrid leads={LEADS} />
        </ProjectSection>

        <ProjectSection title="Demo">
          <DemoPending />
        </ProjectSection>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackToProjects />
        </div>
      </div>
    </div>
  )
}
