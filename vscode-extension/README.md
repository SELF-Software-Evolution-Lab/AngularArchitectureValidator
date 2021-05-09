# Angular Architecture Validator

### What is it?

The **Angular Architecture Validator** provides the developers with a tool that allows them to visualize and understand the problems or violations in a previously defined architecture as they build a web software product using the Angular framework.

The tool will use the architecture defined by the developer to validate the code that is being written, the interactions between components, and other rules that the developer determines as relevant and wishes to maintain during the complete development cycle of the project.

<br/>

### How does it work?

Download the VS Code Extension [Angular Architecture Validator](https://marketplace.visualstudio.com/items?itemName=AngularArchitecturePersonal.angular-architecture) and define a set of rules to follow the desired project's architecture. The `arc.config.json` file should be located at the root of the project (for example, the package.json file is located at the root of the project). The structure of the architecture rules should be as follows.

```json
{
	"entity": {
		"components": {
			"actions": ["create", "delete", "detail", "list"],
			"files": {
				"styles": true,
				"html": true,
				"spec": true
			}
		},
		"module": true,
		"dto": true,
		"dto.spec": true,
		"service": true,
		"service.spec": true
	},
	"app": {
		"routing": true,
		"module": true,
		"component": {
			"spec": true,
			"html": true,
			"styles": true
		},
		"styles": "css"
	},
	"documentation": {
		"attributes": true,
		"functions": true
	}
}
```

**entity**

> In the Java programing language, an `entity` is a lightweight persistence domain object. Typically, an entity represents a _table_ in a relational database, and each entity instance corresponds to a row in that table. In Angular projects, take for example the [Australian Department of Home Affairs](https://immi.homeaffairs.gov.au/) website (build with Angular). On this website, you can **view all** the available visas, navigate to the **details** of a specific visa, or apply for a visa through a **registration form**. In this simple example, a **visa** could be an entity. In our Angular project, it would be a _module_, with components such as visa-list, visa-detail, visa-create, etc.

-   **components** of an Angular project module might be defined to represent some **CRUD** actions, and -based on the scope of the project- each component could require a style (styles), a template (html), and testing (spec) files.

    -   **actions**: An array of strings defines how the naming of a module's components is going to be handled. In the previous example, for the _visa_ module, the expected components would be _visa-create_, _visa-delete_, _visa-detail_, and _visa-list_.

    -   **files**: A true/false boolean value defines the required files for each component. Said files are: a styling file (.css, .sass, etc), a template file (.html), and a testing file (.spec.ts).

-   **module**: A true/false boolean value that indicates if an entity requires a `.module.ts` file. For our previous example, a `visa.module.ts` file.

-   **dto**: A true/false boolean value that indicates if an entity requires a `.dto.ts` file. This file is very commonly used as an interface or Data Type Object that represents an entity. For our example, the _visa_ module would require a `visa.dto.ts` file where the visa interface would be a data structure with some properties: a name, an expiry date, an ID, etc.

-   **dto.spec**: A true/false boolean value used to indicate if the module requires a `.dto.spec.ts` file. This file could be used while testing the Angular project.

-   **service**: A true/false boolean value that indicates if the module requires a `.service.ts` file. This file is commonly used as a singleton object that gets instantiated only once during the lifetime of an application. Services files contain methods that maintain data throughout the life of an application, i.e. data does not get refreshed and is available all the time. The main purpose of a service is to organize and share business logic, models, or data and functions with different components of an Angular application.

-   **service.spec**: A true/false boolean value which, similarly to the _dto.spec_ rule, indicates if a module requires a `.service.spec.ts` file. This file could be helpful when testing the Angular application.

<br/>

**app**

> This set of rules are defined to establish the structure of the root (main) module of the Angular application. This is the **app** module by default when an Angular application is instantiated.

-   **routing**: A true/false boolean value that indicates whether an app-routing.module.ts file is required or not. This file is used as a scaffold to define the routing and navigation throughout the application.

-   **module**: A true/false boolean value that indicates if the `app.module.ts` is required.

-   **component** defines the required files for the `app` module's component. Said files are: a styling file (.css, .sass, etc), a template file (.html), and a testing file (.spec.ts).

-   **styles**: This string-value rule is used to define the styling to be used in the Angular application. The expected values would be "css" for `.css` format styling files, "sass" for `.sass` files, "less" for `.less` files, etc.

<br/>

**documentation**

> For a programmer reliable documentation is always a must. The presence of documentation helps keep track of all aspects of an application and it improves the quality of a software product. See [The Importance of Documentation in Software Development](https://filtered.com/blog/post/project-management/the-importance-of-documentation-in-software-development#:~:text=For%20a%20programmer%20reliable%20documentation,knowledge%20transfer%20to%20other%20developers.)

-   **attributes**: A true/false boolean value used to define if documentation is required for each attribute or property of a class or interface. It also defines if said attributes must indicate its visibility, via the keywords: _public_, _private_, or _protected_.

-   **functions**: A true/false boolean value used to define if documentation is required for each function/method of a class.

<br/>

### Workflow

Once the above rules are defined, you can start coding. If your code does not satisfy said rules, some **grey-colored highlights** are going to be placed where a rule is being broken or is missing. **Tip**: these grey highlights are not errors, and these highlights won't prevent your code from compiling. However, these highlights are useful to identify architectural flaws in your code. See the [Knowledge Base](https://self-software-evolution-lab.github.io/AngularArchitectureValidator/).

![alt text][r10-1]

![alt text][r10-2]

![alt text][r10-solved]

[r10-1]: https://github.com/SELF-Software-Evolution-Lab/AngularArchitectureValidator/blob/main/images/r10-1.png?raw=true 'Missing attribute visibility warning.'
[r10-2]: https://github.com/SELF-Software-Evolution-Lab/AngularArchitectureValidator/blob/main/images/r10-2.png?raw=true 'Missing documentation warning.'
[r10-solved]: https://github.com/SELF-Software-Evolution-Lab/AngularArchitectureValidator/blob/main/images/r10-solved.png?raw=true) 'R10 Solved.'

<br/>

### Contribute

We are happy to see suggestions on how to improve the extension (feature requests) or code suggestions. Everything is welcome through the repository's [issues](https://github.com/SELF-Software-Evolution-Lab/AngularArchitectureValidator/issues) site.

<br/>

### License

Licensed under the MIT License.
