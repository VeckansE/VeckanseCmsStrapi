import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import commander from "commander";
import { checkInstallPath, generateNewApp } from "@strapi/generate-new";
import inquirer from "inquirer";
async function promptUser(projectName, program, hasDatabaseOptions) {
  return inquirer.prompt([
    {
      type: "input",
      default: "my-strapi-project",
      name: "directory",
      message: "What would you like to name your project?",
      when: !projectName
    },
    {
      type: "list",
      name: "quick",
      message: "Choose your installation type",
      when: !program.quickstart && !hasDatabaseOptions,
      choices: [
        {
          name: "Quickstart (recommended)",
          value: true
        },
        {
          name: "Custom (manual settings)",
          value: false
        }
      ]
    }
  ]);
}
const packageJson = JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf8"));
const command = new commander.Command(packageJson.name);
const databaseOptions = [
  "dbclient",
  "dbhost",
  "dbport",
  "dbname",
  "dbusername",
  "dbpassword",
  "dbssl",
  "dbfile"
];
command.version(packageJson.version).arguments("[directory]").option("--no-run", "Do not start the application after it is created").option("--use-npm", "Force usage of npm instead of yarn to create the project").option("--debug", "Display database connection error").option("--quickstart", "Quickstart app creation").option("--dbclient <dbclient>", "Database client").option("--dbhost <dbhost>", "Database host").option("--dbport <dbport>", "Database port").option("--dbname <dbname>", "Database name").option("--dbusername <dbusername>", "Database username").option("--dbpassword <dbpassword>", "Database password").option("--dbssl <dbssl>", "Database SSL").option("--dbfile <dbfile>", "Database file path for sqlite").option("--dbforce", "Overwrite database content if any").option("--template <templateurl>", "Specify a Strapi template").option("--ts, --typescript", "Use TypeScript to generate the project").description("create a new application").action((directory, programArgs) => {
  initProject(directory, programArgs);
}).parse(process.argv);
function generateApp(projectName, options) {
  if (!projectName) {
    console.error("Please specify the <directory> of your project when using --quickstart");
    process.exit(1);
  }
  return generateNewApp(projectName, options).then(() => {
    if (process.platform === "win32") {
      process.exit(0);
    }
  });
}
async function initProject(projectName, programArgs) {
  if (projectName) {
    await checkInstallPath(resolve(projectName));
  }
  const programFlags = command.createHelp().visibleOptions(command).reduce((acc, { short, long }) => [...acc, short, long], []).filter(Boolean);
  if (programArgs.template && programFlags.includes(programArgs.template)) {
    console.error(`${programArgs.template} is not a valid template`);
    process.exit(1);
  }
  const hasDatabaseOptions = databaseOptions.some((opt) => programArgs[opt]);
  if (programArgs.quickstart && hasDatabaseOptions) {
    console.error(
      `The quickstart option is incompatible with the following options: ${databaseOptions.join(
        ", "
      )}`
    );
    process.exit(1);
  }
  if (hasDatabaseOptions) {
    programArgs.quickstart = false;
  }
  if (programArgs.quickstart) {
    return generateApp(projectName, programArgs);
  }
  const prompt = await promptUser(projectName, programArgs, hasDatabaseOptions);
  const directory = prompt.directory || projectName;
  await checkInstallPath(resolve(directory));
  const options = {
    template: programArgs.template,
    quickstart: prompt.quick || programArgs.quickstart
  };
  const generateStrapiAppOptions = {
    ...programArgs,
    ...options
  };
  return generateApp(directory, generateStrapiAppOptions);
}
//# sourceMappingURL=create-strapi-app.mjs.map
