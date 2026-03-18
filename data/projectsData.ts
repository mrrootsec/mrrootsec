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
  {
    title: 'ReTab',
    description: ` Anyone who has used Burp Suite Repeater for more than 20 minutes knows the problem. You send request after request, and every tab is named 1, 2, 3... Ten tabs in, you are clicking through each one trying to find that one password reset endpoint you tested earlier. Fifty tabs in, you have lost track entirely.`,
    imgSrc: '/static/images/retab.png',
    href: 'https://github.com/mrrootsec/ReTab',
  }
]

export default projectsData
