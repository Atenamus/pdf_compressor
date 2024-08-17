#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import treeprompt from "inquirer-file-tree-selection-prompt";
inquirer.registerPrompt("file-tree-selection", treeprompt);

const compressionLevels = {
  "Low (faster, larger file size)": "/screen",
  "Medium (balanced)": "/ebook",
  "High (slower, smaller file size)": "/prepress",
};

async function main() {
  console.log(chalk.blue.bold("PDF Compression Tool"));

  const { pdfName } = await inquirer.prompt({
    type: "file-tree-selection",
    name: "pdfName",
    message: "Enter the name of the PDF file:",
    validate: (input) => {
      if (!input.endsWith(".pdf")) {
        return "Please select a valid PDF file.";
      }
      if (!fs.existsSync(input)) {
        return "File Doesn't Exist";
      }
      return true;
    },
  });

  const { compressionLevel } = await inquirer.prompt({
    type: "list",
    name: "compressionLevel",
    message: "Choose a compression level:",
    choices: Object.keys(compressionLevels),
  });

  const dirName = path.dirname(pdfName);
  const baseName = path.basename(pdfName, ".pdf");

  const outputName = path.join(dirName, `compressed_${baseName}.pdf`);
  const spinner = createSpinner("Compressing PDF...").start();

  const gsCommand = process.platform === "win32" ? "gswin64" : "gs";
  try {
    execSync(
      `${gsCommand} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${compressionLevels[compressionLevel]} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputName} ${pdfName}`
    );
    spinner.success({
      text: chalk.green(
        `PDF compressed successfully! Output file: ${outputName}`
      ),
    });
  } catch (error) {
    spinner.error({
      text: chalk.red(
        "Error compressing PDF. Make sure Ghostscript is installed and the input file is valid."
      ),
    });
    console.error(error);
  }
}

main();
