import styled from 'styled-components'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import glob from 'glob'
import Typography from 'components/Typography'
import get from 'utils/get'
import PreTitle from 'components/PreTitle'
import Link from 'components/Link'
import { useRouter } from 'next/router'
import ResourceCenter from 'layouts/ResourceCenter'
import getLegalData from '../../data/legal'

const Container = styled.div`
  padding-top: 48px;
  background-color: ${get('colors.valhalla.800')};
`

const Markdown = styled.div`
  color: ${get('colors.ashes.900')};
  margin-top: 16px;
  font-family: Inter;
  h1 {
    color: ${get('colors.white')};
    display: block;
  }
  h2 {
    color: ${get('colors.ashes.600')};
    display: block;
  }
  h3 {
    color: ${get('colors.hotPink')};
    display: block;
  }
  a {
    color: ${get('colors.white')};
    border-bottom: 1px solid ${get('colors.hotPink')};
  }
`

const LeftColumn = styled.div`
  color: ${get('colors.ashes.900')};
`

const PagesName = styled(Typography)`
  margin-top: 6px;
  padding-left: 20px;
  border-left: 3px solid transparent;

  &.active {
    color: ${get('colors.hotPink')};
    font-weight: ${get('fontWeight.bold')};
    border-left: 3px solid ${get('colors.hotPink')};
  }
  &:first-letter {
    text-transform: uppercase;
  }
`

const LeftColumnTitle = styled(Typography)`
  color: ${get('colors.white')};
  margin-bottom: 16px;
`

const MiddleColumn = styled(ResourceCenter.MiddleColumn)`
  padding: 0 16px;
`

const LegalPage = ({ markdownBody, legalPages }) => {
  const { content } = getLegalData()
  const router = useRouter()
  return (
    <Container>
      <ResourceCenter>
        <ResourceCenter.LeftColumn>
          <LeftColumn>
            <LeftColumnTitle
              variant="body.s.bold"
              style={{ color: get('colors.white') }}
            >
              {content.legal}
            </LeftColumnTitle>
            {legalPages.map(legalPage => (
              <Link href={`/${legalPage}`} key={legalPage}>
                <PagesName
                  style={{ display: 'block' }}
                  className={router.asPath === `/${legalPage}` ? 'active' : ''}
                >
                  {legalPage.replace(new RegExp('-', 'g'), ' ')}
                </PagesName>
              </Link>
            ))}
          </LeftColumn>
        </ResourceCenter.LeftColumn>
        <MiddleColumn>
          <PreTitle preTitle={content.legal} color={get('colors.hotPink')} />
          <Markdown>
            <ReactMarkdown
              components={{
                h1: props => (
                  <Typography variant="title.m" forwardedAs="h1" {...props} />
                ),
                h2: props => (
                  <Typography variant="title.s" forwardedAs="h2" {...props} />
                ),
                h3: props => (
                  <Typography variant="title.xs" forwardedAs="h3" {...props} />
                ),
              }}
            >
              {markdownBody}
            </ReactMarkdown>
          </Markdown>
        </MiddleColumn>
      </ResourceCenter>
    </Container>
  )
}

const getLegalPages = () => {
  const markdownPages = glob.sync('src/pages/**/*.mdx')

  const slugs = markdownPages.map(file => {
    const parts = file.split('/')
    return parts[parts.length - 1].replace('.mdx', '')
  })

  return slugs
}

export async function getStaticProps({ params }) {
  const { legal } = params
  const content = await import(`./${legal}.mdx`)
  const data = matter(content.default)

  const legalPages = getLegalPages()

  return {
    props: {
      legalPages,
      markdownBody: data.content,
    },
  }
}

export async function getStaticPaths() {
  const slugs = getLegalPages()

  const paths = slugs.map(slug => ({
    params: { legal: slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export default LegalPage
