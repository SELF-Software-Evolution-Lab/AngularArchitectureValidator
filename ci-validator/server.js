const readHelpers = require('./readHelpers');
const validator = require('./validator');
const gitHub = require('./github');

var gitHubConfig;
var gitHubIssues;
var config;
var issues;

const loadConfigFile = async (configPath) => {
  try { config = JSON.parse(await readHelpers.readFile(configPath)); }
  catch (err) { throw new Error(`Error: There was a problem loading config file`); }
}

const getGitHubIssuesEndPoint = async (projectPath,) => {
  try {
    const gitConfig = await readHelpers.readFile(`${projectPath}/.git/config`);
    const repoUrl = gitConfig.split("\n\t").find(el => el.includes("https://github.com")).replace("url = ", "");
    return repoUrl.replace(".git", "/issues").replace("https://github.com/", "https://api.github.com/repos/");
  }
  catch (err) { throw new Error(`Error: There was a problem getting gitHub config from project folder`); }
}

let main = async (configPath, projectPath) => {
  if (!configPath) return console.error("Error: Please provide a config path in run script.");
  if (!projectPath) return console.error("Error: Please provide a project path in run script.");
  if (!process.env.ghToken) return console.error("Error: Please set a github auth token environment variable.");

  console.info("Config Path: " + configPath);
  console.info("Project Path: " + projectPath);
  console.info("Github auth token: " + process.env.ghToken);
  console.info("--------------------------------------------------------------");

  /* Try load configuration file */
  try { await loadConfigFile(configPath); }
  catch (error) { return console.error(error); }

  /* Try run validators and save issues in variable*/
  try { issues = await validator.getIssues(projectPath, config); }
  catch (error) { return console.error(error); }

  /* Try get Github config from project folder */
  try {
    const endPoint = await getGitHubIssuesEndPoint(projectPath);
    const header = { headers: { 'Authorization': `token ${process.env.ghToken}` } };
    gitHubConfig = { endPoint, header };
  }
  catch (error) { return console.error(error); }

  /* Try get issues from Github Repository */
  try { gitHubIssues = await gitHub.getIssues(gitHubConfig.endPoint, gitHubConfig.header); }
  catch (error) { return console.error(error); }

  /* Iterate on issues found and check if exist in github, if false, create a new github issue, else skip */
  for (var issue of issues) {
    if (!gitHubIssues.includes(issue)) {
      try {
        await gitHub.createIssue(gitHubConfig.endPoint, gitHubConfig.header, issue);
        console.log(`Succesfully created: ${issue}`);
      }
      catch (error) { return console.error(error); }
    }
    else { console.log(`Issue '${issue}' already exist in github.`); }
  }

  console.log("");
  console.log("Success.");

}

main(process.argv[2], process.argv[3]);