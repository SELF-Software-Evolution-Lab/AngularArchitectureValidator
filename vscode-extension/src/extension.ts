import * as vscode from "vscode";
var path = require("path");
const fs = require("fs");

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("Angular Validator Activated.");

  // ==============================================================
  // ==============================================================
  // ==============================================================

  /**
   * * Entity defined Actions
   */
  let VALID_ACTIONS: string[] = ["list", "create", "detail", "delete"];

  /**
   * * Entity associated files
   */
  let ENTITY_FILES_STYLE: boolean = true;
  let ENTITY_FILES_HTML: boolean = true;
  let ENTITY_FILES_SPEC: boolean = true;

  /**
   * * Entity defined with module
   */
  let ENTITY_MODULE: boolean = true;

  /**
   * * Entity class
   */
  let ENTITY_CLASS: boolean = true;

  /**
   * * Entity class specs
   */
  let ENTITY_CLASS_SPECS: boolean = true;

  /**
   * * Entity service
   */
  let ENTITY_SERVICE: boolean = true;

  /**
   * * Entity service specs
   */
  let ENTITY_SERVICE_SPECS: boolean = true;

  /**
   * * Main App routing
   */
  let APP_ROUTING: boolean = true;

  /**
   * * Main APP Module
   */
  let APP_MODULE: boolean = true;

  /**
   * * Main APP Styling
   */
  let APP_STYLING: string = "css";

  /**
   * * Main App Component w/ Specs
   */
  let APP_COMPONENT_SPECS: boolean = true;

  /*
   * * Main App Component w/ HTML
   */
  let APP_COMPONENT_HTML: boolean = true;

  /*
   * * Main App Component w/ CSS
   */
  let APP_COMPONENT_STYLE: boolean = true;

  /*
   * * Documentation: attributes
   */
  let DOCUMENTATION_ATTRS: boolean = true;

  /*
   * * Documentation: functions
   */
  let DOCUMENTATION_FUNCS: boolean = true;

  // ==============================================================
  // ==============================================================
  // ==============================================================

  let timeout: NodeJS.Timer | undefined = undefined;

  // * Decorators
  const warningDecorator = vscode.window.createTextEditorDecorationType({
    backgroundColor: "grey",
    color: "white",
  });

  let activeEditor = vscode.window.activeTextEditor;

  async function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    // * [0] Configuation File
    const configGlob: string = `**/arc.config.json`;

    await vscode.workspace
      .findFiles(configGlob, "**/node_modules/**", 1)
      .then((uris: vscode.Uri[]) => {
        if (uris && uris.length) {
          const filePath = uris[0].fsPath;
          const jsonConfigData = JSON.parse(fs.readFileSync(filePath));

          const {
            entity = undefined,
            documentation = undefined,
            app = undefined,
          } = jsonConfigData || {};

          if (entity) {
            const {
              components = undefined,
              module = true,
              dto = true,
              service = true,
            } = entity;

            if (components) {
              if (components["actions"]) VALID_ACTIONS = components["actions"];
              if (components["files"]) {
                const filesConfig: any = components["files"];
                if (filesConfig["styles"] != undefined) {
                  ENTITY_FILES_STYLE = filesConfig["styles"];
                }
                if (filesConfig["html"] != undefined) {
                  ENTITY_FILES_HTML = filesConfig["html"];
                }
                if (filesConfig["spec"] != undefined) {
                  ENTITY_FILES_SPEC = filesConfig["spec"];
                }
              }
            }

            if (module != undefined) {
              ENTITY_MODULE = module;
            }

            if (dto != undefined) {
              ENTITY_CLASS = dto;
            }

            if (entity["dto.spec"] != undefined) {
              ENTITY_CLASS_SPECS = entity["dto.spec"];
            }

            if (service != undefined) {
              ENTITY_SERVICE = service;
            }

            if (entity["service.specs"] != undefined) {
              ENTITY_SERVICE_SPECS = entity["service.spec"];
            }
          }

          if (documentation) {
            const { attributes = true, functions = true } = documentation;

            DOCUMENTATION_ATTRS = attributes;
            DOCUMENTATION_FUNCS = functions;
          }

          if (app) {
            const {
              routing = true,
              module = true,
              component = undefined,
              styles = "css",
            } = app;

            APP_ROUTING = routing;
            APP_MODULE = module;
            APP_STYLING = styles;

            if (component) {
              const { specs = true, html = true, styles = true } = component;
              APP_COMPONENT_SPECS = specs;
              APP_COMPONENT_HTML = html;
              APP_COMPONENT_STYLE = styles;
            }
          }
        }
      });

    // * [1] Buscar el MODULE entre los archivos del mismo directorio
    const _path_: string = activeEditor?.document.uri.path || "";
    const fragments: string[] = _path_.split("/");
    const fragments_backup = [...fragments];

    // * APP FILES
    const indexApp: number = fragments.findIndex((item) => `${item}` === "app");
    if (indexApp < 0) return;

    // * Verificacion de archivos APP MODULE

    let validRouting: boolean = true;
    let validAppModule: boolean = true;
    let validAppSpec: boolean = true;
    let validAppHtml: boolean = true;
    let validAppStyle: boolean = true;

    let filesInCurrentDir: string[] = [];
    const appFileArray: string[] = [...fragments];
    appFileArray.pop();
    try {
      fs.readdirSync(appFileArray.join("/")).forEach((file: string) => {
        filesInCurrentDir.push(file);
      });
    } catch (error) {
      try {
        fs.readdirSync(appFileArray.slice(1).join("/")).forEach(
          (file: string) => {
            filesInCurrentDir.push(file);
          }
        );
      } catch (error) {
        console.log("Catched Error reading file dir.", error);
      }
    }
    if (filesInCurrentDir.some((file) => `${file}`.includes(".component.ts"))) {
      validRouting = filesInCurrentDir.some((file) =>
        `${file}`.includes("app-routing.module.ts")
      );
      validAppModule = filesInCurrentDir.some(
        (file) => `${file}` === "app.module.ts"
      );
      validAppSpec = filesInCurrentDir.some((file) =>
        `${file}`.includes(`app.component.spec.ts`)
      );
      validAppHtml = filesInCurrentDir.some((file) =>
        `${file}`.includes(`app.component.html`)
      );
      validAppStyle = filesInCurrentDir.some((file) =>
        `${file}`.includes(`app.component.${APP_STYLING}`)
      );
    }

    let hooverMessage: string = "";

    // * Verificación de modulo existente
    if (APP_ROUTING && !validRouting) {
      hooverMessage += `\n* Missing routing file: app-routing.module.ts`;
    } else if (!APP_ROUTING && validRouting) {
      hooverMessage += `\n* Routing file is not required: app-routing.module.ts`;
    }

    if (APP_MODULE && !validAppModule) {
      hooverMessage += `\n* Missing app module file: app.module.ts`;
    } else if (!APP_MODULE && validAppModule) {
      hooverMessage += `\n* App module file is not required: app.module.ts`;
    }

    if (APP_COMPONENT_SPECS && !validAppSpec) {
      hooverMessage += `\n* Missing app component spec file: app.component.spec.ts`;
    } else if (!APP_COMPONENT_SPECS && validAppSpec) {
      hooverMessage += `\n* App component spec file is not required: app.component.spec.ts`;
    }

    if (APP_COMPONENT_HTML && !validAppHtml) {
      hooverMessage += `\n* Missing app component html file: app.component.html`;
    } else if (!APP_COMPONENT_HTML && validAppHtml) {
      hooverMessage += `\n* App component html file is not required: app.component.html`;
    }

    if (APP_COMPONENT_STYLE && !validAppStyle) {
      hooverMessage += `\n* Missing app style file: app.component.${APP_STYLING}`;
    } else if (!APP_COMPONENT_STYLE && validAppStyle) {
      hooverMessage += `\n* Aapp style file is not required: app.component.${APP_STYLING}`;
    }

    const classNameWarnings: vscode.DecorationOptions[] = [];

    if (hooverMessage) {
      const startPos = activeEditor.document.positionAt(0);
      const endPos = activeEditor.document.positionAt(6);
      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: hooverMessage,
      };
      classNameWarnings.push(decoration);
      activeEditor.setDecorations(warningDecorator, classNameWarnings);
    }

    // * Verificaciones APP/COMPONENTS
    const dirName = fragments[indexApp + 1];
    let glob = `**/src/app/${dirName}/**`;

    vscode.workspace
      .findFiles(glob, "**/node_modules/**", 500)
      .then((uris: vscode.Uri[]) => {
        if (!activeEditor) {
          return;
        }

        let files: string[] = [];
        uris.forEach((uri: vscode.Uri) => {
          files.push(uri.path);
        });

        const moduleName: string =
          files
            .find((item) => item.includes(".module.ts"))
            ?.split("/")
            .pop()
            ?.split(".")[0] || "";

        if (!files.length) {
          return;
        }

        if (moduleName.includes("routing")) {
          return;
        }

        if (moduleName.length < 1) {
          vscode.window.showErrorMessage("Component missing module file.");
          return;
        }

        // ** Verificación de archivos HTML, STYLE, SPECS
        fragments_backup.pop();
        const currentDirArray: any[] = fragments_backup;

        let validStyle: boolean = true;
        let validHTML: boolean = true;
        let validSpecs: boolean = true;
        let validDTO: boolean = true;
        let validDTOspec: boolean = false;
        let validService: boolean = true;
        let validServiceSpec: boolean = true;
        let validModule: boolean = true;

        let filesInCurrentDir: string[] = [];
        try {
          fs.readdirSync(currentDirArray.join("/")).forEach((file: string) => {
            filesInCurrentDir.push(file);
          });
        } catch (error) {
          try {
            fs.readdirSync(currentDirArray.slice(1).join("/")).forEach(
              (file: string) => {
                filesInCurrentDir.push(file);
              }
            );
          } catch (error) {
            console.log("Catched Error reading file dir.", error);
          }
        }

        if (
          filesInCurrentDir.some((file) => `${file}`.includes(".component.ts"))
        ) {
          validSpecs = filesInCurrentDir.some((file) =>
            `${file}`.includes(".component.spec")
          );
          validHTML = filesInCurrentDir.some((file) =>
            `${file}`.includes(".component.html")
          );
          validStyle = filesInCurrentDir.some((file) =>
            `${file}`.includes(`.component.${APP_STYLING}`)
          );
        } else {
          validDTO = filesInCurrentDir.some((file) =>
            `${file}`.includes(`${moduleName}.ts`)
          );
          validDTOspec = filesInCurrentDir.some(
            (file) => `${file}` === `${moduleName}.spec.ts`
          );

          validService = filesInCurrentDir.some((file) =>
            `${file}`.includes(`${moduleName}.service.ts`)
          );
          validServiceSpec = filesInCurrentDir.some((file) =>
            `${file}`.includes(`${moduleName}.service.spec.ts`)
          );

          validModule = filesInCurrentDir.some(
            (file) => `${file}` === `${moduleName}.module.ts`
          );
        }

        // * [2] Extraer el nombre del .module
        const module: string =
          moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        // * [3] Leer archivo y obtener el tipo de archivo (ejmplo: service | component)
        const fileFragment: string = fragments.pop()?.split(".")[1] || "";

        const fileName: string[] = fragments.pop()?.split("-") || [];
        const fileNameModule: string = fileName[0] || "";
        const fileCrudAction: string = fileName[1] || "";

        let fileType = fileFragment;

        let fileActionName: string = fileCrudAction;

        const classNameWarnings: vscode.DecorationOptions[] = [];

        let hooverMessage: string = "";

        // * Verificación de modulo existente
        if (ENTITY_MODULE && !validModule) {
          hooverMessage += `\n* Component missing module file: ${moduleName}.module.ts`;
        } else if (!ENTITY_MODULE && validModule) {
          hooverMessage += `\n* Component module file is not required: ${moduleName}.module.ts`;
        }

        // * Verificación de DTO
        if (ENTITY_CLASS && !validDTO) {
          hooverMessage += `\n* Component missing dto file: ${moduleName}.ts`;
        } else if (!ENTITY_CLASS && validDTO) {
          hooverMessage += `\n* Component dto file is not required: ${moduleName}.ts`;
        }

        // * Verificación de Service file
        if (ENTITY_SERVICE && !validService) {
          hooverMessage += `\n* Component missing service file: ${moduleName}.service.ts`;
        } else if (!ENTITY_SERVICE && validService) {
          hooverMessage += `\n* Component service file is not required: ${moduleName}.service.ts`;
        }

        // * Verificación de Service spec file
        if (ENTITY_SERVICE_SPECS && !validServiceSpec) {
          hooverMessage += `\n* Component missing service spec file: ${moduleName}.service.spec.ts`;
        } else if (!ENTITY_SERVICE_SPECS && validServiceSpec) {
          hooverMessage += `\n* Component service spec file is not required: ${moduleName}.service.spec.ts`;
        }

        // * Verificación de estilos
        if (ENTITY_FILES_STYLE && !validStyle) {
          hooverMessage += `\n* Component missing style file: .${APP_STYLING}`;
        } else if (!ENTITY_FILES_STYLE && validStyle) {
          hooverMessage += `\n* Component style file is not required: .${APP_STYLING}`;
        }

        // * Verificación de template HTML
        if (ENTITY_FILES_HTML && !validHTML) {
          hooverMessage += `\n* Component missing HTML template file: .html`;
        } else if (!ENTITY_FILES_HTML && validHTML) {
          hooverMessage += `\n* Component HTML template file is not required: .html`;
        }

        // * Verificación de template HTML
        if (ENTITY_FILES_SPEC && !validSpecs) {
          hooverMessage += `\n* Component missing spce file: .spec.ts`;
        } else if (!ENTITY_FILES_SPEC && validSpecs) {
          hooverMessage += `\n* Component spce file is not required: .spec.ts`;
        }

        // * Verificación en nombre de directorio - módulo
        if (!moduleName.includes("routing")) {
          if (
            ENTITY_MODULE &&
            VALID_ACTIONS.length &&
            fileNameModule.toLowerCase() !== moduleName.toLowerCase()
          ) {
            hooverMessage += `\n* Incorrect folder name: ${fileNameModule}. The folder should be named following the structure module-action. Module: ${moduleName}. Actions: ${VALID_ACTIONS.join(
              ", "
            )}. Example: ${moduleName}-${VALID_ACTIONS[0]}`;
          }

          if (fileFragment.length > 2) {
            fileType =
              fileFragment.charAt(0).toUpperCase() + fileFragment.slice(1);
          }

          if (fileCrudAction.length > 2) {
            fileActionName =
              fileCrudAction.charAt(0).toUpperCase() + fileCrudAction.slice(1);
            if (!VALID_ACTIONS.includes(fileCrudAction)) {
              hooverMessage += `\n* Incorrect folder name: ${fileNameModule}-invalidAction. The folder should be named following the structure module-action. Module: ${moduleName}. Actions: ${VALID_ACTIONS.join(
                ", "
              )}. Example: ${moduleName}-${VALID_ACTIONS[0]}`;
            }
          }
        }

        if (hooverMessage) {
          const startPos = activeEditor.document.positionAt(0);
          const endPos = activeEditor.document.positionAt(6);
          const decoration = {
            range: new vscode.Range(startPos, endPos),
            hoverMessage: hooverMessage,
          };
          classNameWarnings.push(decoration);
          activeEditor.setDecorations(warningDecorator, classNameWarnings);
        }

        const text = activeEditor.document.getText();

        // * Validación en nombre de la class
        if (!["ts", "module"].includes(`${fileType}`.toLowerCase())) {
          const regEx = new RegExp(
            `class (?!${module}${fileActionName}${fileType})`,
            "g"
          ); // - /([A-Z][a-z])\w+/g;
          let match;
          while ((match = regEx.exec(text))) {
            // * [4] Agrega un decoration en donde hay un match REGEX
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(
              match.index + match[0].length - 1
            );

            const decoration = {
              range: new vscode.Range(startPos, endPos),
              hoverMessage: `\n* Incorrect class declaration. The class should be: ${module}${fileActionName}${fileType}`,
            };
            classNameWarnings.push(decoration);
          }
          activeEditor.setDecorations(warningDecorator, classNameWarnings);
        }

        // * Verificación en documentación de atributos
        if (DOCUMENTATION_ATTRS) {
          const textLines: string[] = text.split("\n");
          textLines.forEach((line, index) => {
            // * Verificación en visibilidad de atributos (public | private | protected)
            if (
              !line.includes("@") &&
              !line.includes("(") &&
              !line.includes(")") &&
              !line.includes("/") &&
              !line.includes("*")
            ) {
              const regExJavaDoc = new RegExp(
                /((?<![public|private|protected])\s[a-zA-Z0-9!#\$%\^\&*\)\(+=._-]+:[\s]*[\S]*;)/,
                "g"
              );
              let matchJavaDoc;
              while ((matchJavaDoc = regExJavaDoc.exec(line))) {
                // * [4] Agrega un decoration en donde hay un match REGEX

                const start = new vscode.Position(index, 2);
                const end = new vscode.Position(index, line.length + 1);

                const decoration = {
                  range: new vscode.Range(start, end),
                  hoverMessage: `\n* Missing attribute visibility. [ public | private | protected ]`,
                };
                classNameWarnings.push(decoration);
              }
              //	activeEditor.setDecorations(warningDecorator, classNameWarnings);
            }

            if (
              !line.includes("@") &&
              !line.includes("constructor") &&
              !line.includes("new") &&
              !line.includes(",") &&
              !line.includes("//") &&
              !line.includes("/*") &&
              !line.includes("this") &&
              !line.includes("if") &&
              (line.includes("private") ||
                line.includes("public") ||
                line.includes("protected") ||
                line.includes("("))
            ) {
              if (index > 0) {
                const prevLine: string = textLines[index - 1];

                if (
                  !prevLine.includes("*/") &&
                  !prevLine.includes(".") &&
                  !prevLine.includes("constructor") &&
                  !prevLine.includes(",")
                ) {
                  if (activeEditor) {
                    let indexParen: number = line.indexOf("(");
                    if (indexParen && indexParen > 0) {
                      line = line.substring(0, indexParen - 1);
                      if (!DOCUMENTATION_FUNCS) return;
                    }
                    const start = new vscode.Position(index, 2);
                    const end = new vscode.Position(index, line.length + 1);

                    const decoration = {
                      range: new vscode.Range(start, end),
                      hoverMessage: `/** Missing documentation. */`,
                    };
                    classNameWarnings.push(decoration);
                  }
                }
              }
            }
          });

          activeEditor.setDecorations(warningDecorator, classNameWarnings);
        }
      });
  }

  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(updateDecorations, 500);
  }

  if (activeEditor) {
    triggerUpdateDecorations();
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );
}
