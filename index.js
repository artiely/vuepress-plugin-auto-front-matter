const path = require('path')
const spawn = require('cross-spawn')
const removeMd = require('remove-markdown');
module.exports = (options = {}, context) => ({
  extendPageData($page) {
    const { author, title, summary, summaryLength = 200, location } = options
    const _author = $page.frontmatter.author || author || getGitAuthors($page._filePath)
    $page.author = _author
    $page.frontmatter.author = _author
    const _title = $page.frontmatter.title || title || getTitle($page._strippedContent)
    $page.title = _title
    $page.frontmatter.title = _title
    const _summary = $page.frontmatter.summary || summary || getSummary($page._strippedContent, summaryLength) || '请查看详情'

    $page.summary = _summary
    $page.frontmatter.summary = _summary
    $page.frontmatter.description = _summary
    const _location = $page.frontmatter.location || location
    $page.location = _location
    $page.frontmatter.location = _location
  }
})


function getGitAuthors(filePath) {
  let authors
  try {
    authors = spawn.sync(
      'git',
      ['log', '--format=%aN--%aE', path.basename(filePath)],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8')
    authors = authors.split('\n')
    authors = [... new Set(authors)]
    authors = authors
      .filter(author => !!author)
      .map(author => {
        return { username: author.split('--')[0], email: author.split('--')[1] }
      })
  } catch (e) { /* do not handle for now */ }
  return authors
}

function getSummary(strippedContent, summaryLength) {

  if (!strippedContent) {
    return;
  }
  return removeMd(strippedContent.trim().replace(/^#+\s+(.*)/, '').slice(0, summaryLength)) +
    ' ...';
}

function getTitle(strippedContent) {
  if (!strippedContent) {
    return;
  }
  const str = strippedContent.trim().slice(0, 100)
  const titleArr = str.match(/^#+\s+(.*)/)
  if (titleArr && titleArr.length && titleArr[1]) {
    return titleArr[1]
  }
  return '未定义标题'
}