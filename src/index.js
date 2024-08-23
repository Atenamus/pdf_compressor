#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import fs from "fs";
import path from "path";
import treeprompt from "inquirer-file-tree-selection-prompt";
import figlet from "figlet";
import * as im from "node-imagemagick";
inquirer.registerPrompt("file-tree-selection", treeprompt);

const compressionLevels = {
  "Low (faster, larger file size)": {
    density: 72,
    quality: 80,
    compress: "jpeg",
  },
  "Medium (balanced)": {
    density: 150,
    quality: 90,
    compress: "jpeg",
  },
  "High (slower, smaller file size)": {
    density: 150,
    quality: 95,
    compress: "jpeg",
  },
};

async function displayFiglet(text) {
  return new Promise((resolve, reject) => {
    figlet(text, { font: "3-D", horizontalLayout: "full" }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve();
      }
    });
  });
}

async function main() {
  try {
    await displayFiglet("cli-tools");
    
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

    try {
      const options = compressionLevels[compressionLevel];
      await new Promise((resolve, reject) => {
        im.convert(
          [
            `${pdfName}[0]`,
            `-density`,
            `${options.density}`,
            `-quality`,
            `${options.quality}`,
            `-compress`,
            `${options.compress}`,
            `${outputName}`,
          ],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });

      const originalSize = fs.statSync(pdfName).size;
      const compressedSize = fs.statSync(outputName).size;
      const compressionRatio = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(2);

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
          "Error compressing PDF. Make sure ImageMagick is installed and the input file is valid."
        ),
      });
      console.error(error.toString());
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

main();
