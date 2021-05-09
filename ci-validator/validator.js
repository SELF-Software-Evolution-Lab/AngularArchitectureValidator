const readHelpers = require('./readHelpers');

exports.getIssues = async (projectPath, config) => {
  let issues = [];

  try {
    let appFolder;
    try {
      appFolder = await readHelpers.readDir(`${projectPath}/src/app`);
    }
    catch (err) { throw err; }

    {
      if (config.app.routing) {
        if (!appFolder.includes('app-routing.module.ts')) issues.push("App must have a app-routing.module.ts file.");
      }
      else {
        if (appFolder.includes('app-routing.module.ts')) issues.push("App should not have an app-routing.module.ts file.");
      }

      if (config.app.component.spec) {
        if (!appFolder.includes('app.component.spec.ts')) issues.push("App must have a app.component.spec.ts file.");
      }
      else {
        if (appFolder.includes('app.component.spec.ts')) issues.push("App should not have an app.component.spec.ts file.");
      }

      if (config.app.component.html) {
        if (!appFolder.includes('app.component.html')) issues.push("App must have a app.component.html file.");
      }
      else {
        if (appFolder.includes('app.component.html')) issues.push("App should not have an app-routing.moappdule.ts file.");
      }

      if (config.app.component.styles) {
        if (!appFolder.includes('app.component.' + config.app.styles)) issues.push("App must have a app.component." + config.app.styles + " file.");
      }
      else {
        if (appFolder.includes('app.component.' + config.app.styles)) issues.push("App should not have an app.component." + config.app.styles + " file.");
      }

      if (config.app.component.ts) {
        if (!appFolder.includes('app.component.ts')) issues.push("App must have a app.component.ts file.");
      }
      else {
        if (appFolder.includes('app.component.ts')) issues.push("App should not have an app.component.ts file.");
      }

      if (config.app.module) {
        if (!appFolder.includes('app.module.ts')) issues.push("App must have a app.module.ts file.");
      }
      else {
        if (appFolder.includes('app.module.ts')) issues.push("App should not have an app.module.ts file.");
      }

      let otherFiles = appFolder.filter(item => (item.includes('.') && item != 'app-routing.module.ts' && item != 'app.module.ts'
        && item != 'app.component.spec.ts' && item != 'app.component.html' && item != ('app.component.' + config.app.styles) && item != 'app.component.ts'));
      if (otherFiles && otherFiles.length > 0) {
        otherFiles.forEach(otherFile => issues.push("The file " + otherFile + " should not be included in app folder."));
      }
    }

    let entities = appFolder.filter(item => !item.includes('.'));
    for (const entity of entities) {
      let entityFolder;
      try {
        entityFolder = await readHelpers.readDir(`${projectPath}/src/app/${entity}`);
      }
      catch (err) { throw err; }

      if (config.entity.module) {
        if (!entityFolder.includes(entity + '.module.ts')) issues.push("The resource " + entity + " must have a module.");
      }
      else {
        if (entityFolder.includes(entity + '.module.ts')) issues.push("The resource " + entity + " should not have a module.");
      }

      if (config.entity.dto) {
        if (!entityFolder.includes(entity + '.ts')) issues.push("The resource " + entity + " must have an entity DTO (Data To Object) class.");
      }
      else {
        if (entityFolder.includes(entity + '.ts')) issues.push("The resource " + entity + " should not have an entity DTO (Data To Object) class.");
      }

      if (config.entity.service) {
        if (!entityFolder.includes(entity + '.service.ts')) issues.push("The resource " + entity + " must have a service.");
      }
      else {
        if (entityFolder.includes(entity + '.service.ts')) issues.push("The resource " + entity + " should not have a service.");
      }

      if (config.entity.dtoSpec) {
        if (!entityFolder.includes(entity + '.spec.ts')) issues.push("The resource " + entity + " must have an entity DTO (Data To Object) class spec.");
      }
      else {
        if (entityFolder.includes(entity + '.spec.ts')) issues.push("The resource " + entity + " should not have an entity DTO (Data To Object) class spec.");
      }

      if (config.entity.serviceSpec) {
        if (!entityFolder.includes(entity + '.service.spec.ts')) issues.push("The resource " + entity + " must have a service spec.");
      }
      else {
        if (entityFolder.includes(entity + '.service.spec.ts')) issues.push("The resource " + entity + " should not have a service spec.");
      }

      let otherResources = entityFolder.filter(item => !item.startsWith(entity));
      if (otherResources && otherResources.length > 0)
        otherResources.forEach(otherResource => issues.push("The resource " + otherResource + " should not be included in " + entity + " folder."));

      /* Check action components */
      for (const action of config.entity.components.actions) {
        let entityComponent = `${entity}-${action}`;
        /* Check if action component are not included in entity's folder */
        if (!entityFolder.includes(entityComponent)) {
          issues.push("The resource " + entity + " must have a " + action + " component.");
        }
        /* Check if entity component files are not included in entity's component folder */
        else {
          let entityComponentFolder;
          try {
            entityComponentFolder = await readHelpers.readDir(`${projectPath}/src/app/${entity}/${entityComponent}`);
            if (config.entity.components.files.styles) {
              if (!entityComponentFolder.includes(entityComponent + ".component." + config.app.styles)) issues.push(entityComponent + " must have a " + entityComponent + ".component." + config.app.styles + " file.");
            }
            else {
              if (entityComponentFolder.includes(entityComponent + ".component." + config.app.styles)) issues.push(entityComponent + " should not have a " + entityComponent + ".component." + config.app.styles + " file.");
            }

            if (config.entity.components.files.html) {
              if (!entityComponentFolder.includes(entityComponent + ".component.html")) issues.push(entityComponent + " must have a " + entityComponent + ".component.html" + " file.");
            }
            else {
              if (entityComponentFolder.includes(entityComponent + ".component.html")) issues.push(entityComponent + " should not have a " + entityComponent + ".component.html" + " file.");
            }

            if (config.entity.components.files.spec) {
              if (!entityComponentFolder.includes(entityComponent + ".component.spec.ts")) issues.push(entityComponent + " must have a " + entityComponent + ".component.spec.ts" + " file.");
            }
            else {
              if (entityComponentFolder.includes(entityComponent + ".component.spec.ts")) issues.push(entityComponent + " should not have a " + entityComponent + ".component.spec.ts" + " file.");
            }

            let otherFiles = entityComponentFolder.filter(item => (item != (entityComponent + ".component." + config.app.styles) && item != (entityComponent + ".component.html")
              && item != (entityComponent + ".component.spec.ts") && item != (entityComponent + ".component.ts")));
            if (otherFiles && otherFiles.length > 0)
              otherFiles.forEach(otherFile => issues.push("The file " + otherFile + " should not be included in " + entityComponent + " folder."));
          } catch (err) { throw err; }
        }
      }
    }

    return issues;
  }
  catch (err) { throw err; }
}