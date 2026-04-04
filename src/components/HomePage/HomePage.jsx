import HeroSection from './HeroSection'
import ExhibitionList from './ExhibitionList'
import { exhibitions } from '../../data/exhibitions'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ExhibitionList exhibitions={exhibitions} />
    </main>
  )
}
