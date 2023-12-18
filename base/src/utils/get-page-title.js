// import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Primeton UI'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
