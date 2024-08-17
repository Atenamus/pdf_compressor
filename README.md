# PDF Compression Tool

## Overview

This command-line tool allows you to compress PDF files using Ghostscript. The tool provides options to choose different compression levels and automatically handles the compression of your PDF files.

## Prerequisites

Before using this tool, ensure that you have the following installed:

1. **Node.js**: [Download and install Node.js](https://nodejs.org/) if you don't have it already.

2. **Ghostscript**: [Download and install Ghostscript](https://www.ghostscript.com/download.html). This tool is required for PDF compression.

## Installation

1. **Clone or Download the Repository**

   ```bash
   git clone https://github.com/Atenamus/pdf_compressor.git
   ```

2. **Install Dependencies**

   Navigate to the directory containing `index.js` and run:

   ```bash
   npm install
   ```

   This installs the required Node.js dependencies.

3. **Create a Batch File (Windows Only)**

   To run the script from anywhere, create a batch file:

   - Open Notepad or any text editor.
   - Add the following content:

     ```batch
     @echo off
     node C:\path\to\your\index.js %*
     ```

   - Save the file as `pdf-compressor.bat` in a directory of your choice (e.g., `C:\Tools`).

   - **Add Directory to PATH:**

     If you want to execute the batch file from anywhere, add the directory containing the batch file to your system PATH:
     
     1. Search for “Environment Variables” in the Start Menu.
     2. Select “Edit the system environment variables.”
     3. In the System Properties window, click “Environment Variables.”
     4. In the Environment Variables window, find the `Path` variable and click “Edit.”
     5. Click “New” and add the path to the directory where your batch file is located.
     6. Click “OK” to close all dialog boxes.

## Usage

1. **Run the Tool**

   Open Command Prompt and type:

   ```bash
   pdf-compressor
   ```

2. **Follow the Prompts**

   - **Select PDF File**: Choose the PDF file you want to compress. The tool will validate that the file exists and is a PDF.
   - **Choose Compression Level**: Select the desired compression level from the options provided.

   The tool will compress the PDF and save the output with a prefix `compressed_` in the same directory as the original file.
