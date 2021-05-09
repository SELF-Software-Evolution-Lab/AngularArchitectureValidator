/* Read information from Json */

readTextFile('./data/rules.json', function (text) {
	var rules = JSON.parse(text);

	/* Build collapsable card */
	rules.forEach((rule, index) => {
		var element = buidlCollapsableElement(index, rule.id, rule.title, rule.lable, rule.time, rule.level, rule.description, rule.solution);

		/* Append new card to accordion */
		var accordion = document.querySelector('#accordion');
		accordion.innerHTML += element;
	});
});

/* Helper method for read json data */
function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType('application/json');
	rawFile.open('GET', file, true);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4 && rawFile.responseText) {
			callback(rawFile.responseText);
		} else {
			callback('[]');
		}
	};
	rawFile.send(null);
}

/* Template collapsable component */
function buidlCollapsableElement(index, id, title, lable, time, level, description, solution) {
	return `
<div class="card">
  <div class="card-header" id="heading${index}">
    <h4 class="mb-0">
      <button class="btn" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true"
        aria-controls="collapse${index}">
        <strong>${id}:</strong>
        <em>${title}</em>
      </button>
    </h4>
  </div>
  <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#accordion">
    <div class="card-body">
      <div class="float-right">
        <div class="badge"><i class="material-icons">label</i>${lable}</div>
        <div class="badge"><i class="material-icons">timer</i>${time}</div>
        <div class="badge"><i class="material-icons">warning</i>${level}</div>
      </div>
      <h5>Description</h5>
      <p>${description}</p>
      <h5>Solution</h5>
      <p>${solution}</p>
    </div>
  </div>
</div>`;
}
