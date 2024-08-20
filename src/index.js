#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import treeprompt from "inquirer-file-tree-selection-prompt";
import figlet from "figlet";
inquirer.registerPrompt("file-tree-selection", treeprompt);

const compressionLevels = {
  "Low (faster, larger file size)": [
    "-dPDFSETTINGS=/screen",
    "-dColorImageDownsampleType=/Subsample",
    "-dColorImageResolution=72",
  ],
  "Medium (balanced)": [
    "-dPDFSETTINGS=/ebook",
    "-dColorImageDownsampleType=/Average",
    "-dColorImageResolution=150",
  ],
  "High (slower, smaller file size)": [
    "-dPDFSETTINGS=/printer",
    "-dColorImageDownsampleType=/Bicubic",
    "-dColorImageResolution=150",
    "-dGrayImageDownsampleType=/Bicubic",
    "-dGrayImageResolution=150",
    "-dMonoImageDownsampleType=/Bicubic",
    "-dMonoImageResolution=150",
  ],
};

async function main() {
  await figlet(
    "cli-tools",
    {
      font: "3-D",
      horizontalLayout: "full",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    (data, err) => {
      if (err) {
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );

  const { pdfName } = await inquirer.prompt({
    type: "file-tree-selection",
    name: "pdfName",
    message: "Select the PDF file:",
    validate: (input) => {
      if (!input.toLowerCase().endsWith(".pdf")) {
        return "Please select a valid PDF file.";
      }
      if (!fs.existsSync(input)) {
        return "File doesn't exist.";
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

  const gsCommand = process.platform === "win32" ? "gswin64c" : "gs";

  try {
    const compressionArgs = compressionLevels[compressionLevel].join(" ");
    const command = `"${gsCommand}" -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 ${compressionArgs} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputName}" "${pdfName}"`;

    execSync(command, { stdio: "pipe" });
    ch;
    const originalSize = fs.statSync(pdfName).size;
    const compressedSize = fs.statSync(outputName).size;
    const compressionRatio = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(2);
    chalk;
    spinner.success({
      text:
        chalk.green("PDF compressed successfully!\n") +
        chalk.white(
          `Original size: ${(originalSize / 1024 / 1024).toFixed(
            2
          )} MB\nCompressed size: ${(compressedSize / 1024 / 1024).toFixed(
            2
          )} MB\nCompression ratio: ${compressionRatio}%\nOutput file: ${outputName}`
        ),
    });
  } catch (error) {
    spinner.error({
      text: chalk.red(
        "Error compressing PDF. Make sure Ghostscript is installed and the input file is valid."
      ),
    });
    console.error(error.toString());
  }
}

main().catch((error) => console.error("An unexpected error occurred:", error));
