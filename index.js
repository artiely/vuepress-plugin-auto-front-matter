const path = require('path')
const spawn = require('cross-spawn')
const removeMd = require('remove-markdown');
module.exports = (options = {}, context) => ({
  extendPageData ($page) {
    const {author,title,summary,summaryLength=200,location} = options
    $page.author = author || getGitAuthors($page._filePath)
    $page.frontmatter.author = author || getGitAuthors($page._filePath)
    $page.summary = summary || getSummary(pageCtx._strippedContent,summaryLength)
    $page.frontmatter.summary = summary || getSummary(pageCtx._strippedContent,summaryLength)
    $page.frontmatter.description = summary || getSummary(pageCtx._strippedContent,summaryLength)
    $page.title = title || getTitle(pageCtx._strippedContent)
    $page.frontmatter.title = title || getTitle(pageCtx._strippedContent)
    $page.location = location
  }
})


function getGitAuthors (filePath) {
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

function getSummary(strippedContent,summaryLength){

  if (!strippedContent) {
    return;
  }
  return removeMd(strippedContent.trim().replace(/^#+\s+(.*)/, '').slice(0, summaryLength)) +
  ' ...';
}

function getTitle(strippedContent){
  if (!strippedContent) {
    return;
  }
  const str =	strippedContent.trim().slice(0, 100)
  const titleArr = str.match(/^#+\s+(.*)/)
  if(titleArr.length&&titleArr[1]){
    return titleArr[1]
  }
  return '未定义标题'
}