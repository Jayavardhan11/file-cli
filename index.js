#!/usr/bin/env node

const fs = require("fs");
const { Command } = require("commander");
const chalk = require("chalk");
const path = require("path");

const program = new Command();

program
  .name("File System")
  .description("CLI file-based tasks")
  .version("0.8.0");

// Create new file
program
  .command("createNewfile")
  .description("Create a new file")
  .argument("<filename>", "Name of the file to create")
  .action((filename) => {
    fs.writeFile(filename, "utf-8", (err) => {
      if (err) {
        console.log(chalk.red(`❌ Failed to create file: ${err.message}`));
      } else {
        console.log(chalk.green(`✅ File '${filename}' created successfully.`));
      }
    });
  });

//READ
program
  .command("read")
  .description("Read a file")
  .argument("<file>", "File to read")
  .action((file) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.log(chalk.red(`❌ Error: ${err.message}`));
      } else {
        console.log(chalk.green(`✅File found : `));
        console.log(data);
      }
    });
  });

//Append data to an exirsting file
program
  .command("append")
  .description("Append content to a file")
  .argument('<filename>,"Fiel to append add')
  .argument("<content>", "Content to append")
  .action((filename, content) => {
    if (!fs.existsSync(filename)) {
      console.log(chalk.red("❌ File does not exist."));
      return;
    }
    fs.appendFileSync(filename, content + "\n");
    console.log(chalk.bgGreen("✅ Content appended succesfully!"));
  });

// delete file
program
  .command("delete")
  .description("Delete the file.")
  .argument("<file>", "file to delete")
  .action((file) => {
    if (!fs.existsSync(file)) {
      console.log(chalk.red("❌ File does not exist."));
      return;
    }
    fs.unlinkSync(file);
    console.log(chalk.yellow(`🗑️ File '${file}' deleted.`));
  });

//RENAME
program
  .command("rename")
  .description("Rename a file")
  .argument("<oldname>", "Current filename")
  .argument("<newname>", "New filename")
  .action((oldname, newname) => {
    if (!fs.existsSync(oldname)) {
      console.log(chalk.red("❌ File does not exist."));
      return;
    }
    fs.renameSync(oldname, newname);
    console.log(chalk.green(`✅ Renamed ${oldname} to ${newname}.`));
  });

//LIST ALL FILES
program
  .command("list")
  .description("List all files and folders in directory")
  .argument("[dir]", "Directory to read", ".")
  .action((dir) => {
    try {
      const files = fs.readdirSync(dir);
      console.log(chalk.cyan(`📂 Contents of '${dir}' :`));
      files.forEach((file) => console.log("-" + file));
    } catch (err) {
      console.log(chalk.red(`❌ Error: ${err.message}`));
    }
  });

//Create a floder
program
  .command("makdir")
  .description("Create a new folder")
  .argument("<folder>", "Folder name")
  .action((folder) => {
    if (fs.existsSync(folder)) {
      console.log(chalk.red(`📂 ${folder} already exists.`));
      return;
    }
    try {
      fs.mkdirSync(folder);
      console.log(chalk.green(`📁 Folder '${folder}' created.`));
    } catch (err) {
      console.log(chalk.red(`❌ Error: ${err.message}`));
    }
  });

// Delete a folder
program
  .command("remdir")
  .description("Delete a folder")
  .argument("<folder>", "Folder name")
  .action((folder) => {
    try {
      fs.rmdirSync(folder, { recursive: true });
      console.log(chalk.yellow(`🗑️ Folder '${folder}' deleted.`));
    } catch (err) {
      console.log(chalk.red(`❌ Error: ${err.message}`));
    }
  });

// Move a file/folder
program
  .command("move")
  .description("Move a file or folder")
  .argument("<source>", "Source file/folder")
  .argument("<destination>", "Destination path")
  .action((src, dest) => {
    try {
      fs.renameSync(src, dest);
      console.log(chalk.green(`📦 Moved from '${src}' to '${dest}'`));
    } catch (err) {
      console.log(chalk.red(`❌ Error: ${err.message}`));
    }
  });

// Search for word in file
program
  .command("search")
  .description("Search for a word in a file")
  .argument("<file>", "File to search in")
  .argument("<word>", "Word to search for")
  .action((file, word) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.log(chalk.red(`❌ Error: ${err.message}`));
        return;
      }
      const lines = data.split("\n");
      const matches = lines
        .map((line, i) =>
          line.includes(word) ? `Line ${i + 1}: ${line}` : null
        )
        .filter(Boolean);
      if (matches.length > 0) {
        console.log(chalk.cyan(`🔍 Found '${word}' in:`));
        matches.forEach((line) => console.log(chalk.white(line)));
      } else {
        console.log(chalk.gray(`❌ '${word}' not found in '${file}'`));
      }
    });
  });

// Count words in a file
program
  .command("countWords")
  .description("Count the number of words in a file")
  .argument("<file>", "File to count")
  .action((file) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.log(chalk.red(`❌ Error: ${err.message}`));
      } else {
        const words = data.trim().split(/\s+/).length;
        console.log(
          chalk.bgGreen.white(`✍️ There are ${words} words in '${file}'`)
        );
      }
    });
  });

// Count lines in a file
program
  .command("countLines")
  .description("Count the number of lines in a file")
  .argument("<file>", "File to count")
  .action((file) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.log(chalk.red(`❌ Error: ${err.message}`));
      } else {
        const lines = data.split("\n").length;
        console.log(
          chalk.bgBlue.white(`📄 There are ${lines} lines in '${file}'`)
        );
      }
    });
  });

program.parse();
