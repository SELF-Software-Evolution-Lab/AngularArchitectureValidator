const axios = require('axios');

exports.getIssues = async (endPoint, header) => {
  try { return (await axios.get(endPoint, header)).data.map(el => el.title); }
  catch (err) { throw new Error(`Error: There was an error requesting issues from ${endPoint}.`); }
}

exports.createIssue = async (endPoint, header, issueTitle) => {
  try { return await axios.post(endPoint, { title: issueTitle }, header); }
  catch (err) { throw new Error(`Error: There was an error sending issue to ${endPoint}.`); }
}