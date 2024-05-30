interface Project {
  title: string,
  description: string,
  href?: string,
  imgSrc?: string,
}

const projectsData: Project[] = [
  {
    title: 'AssetViz',
    description: ` AssetViz simplifies the visualization of subdomains from input files, presenting them as a coherent mind map.
    Ideal for penetration testers and bug bounty hunters conducting reconnaissance, AssetViz provides intuitive insights into domain structures for informed decision-making. `,
    imgSrc: '/static/images/assetviz.png',
    href: 'https://github.com/mrrootsec/AssetViz',
  },
]

export default projectsData