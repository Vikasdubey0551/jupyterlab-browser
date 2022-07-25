/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/


import { time } from 'console';
import * as vscode from 'vscode';
const { execSync } = require('node:child_process')

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	const myCommandId = 'jupyterlab-browser.startServer';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		const jupyter = isJupyterServerRunning();
		if (!jupyter){
		let terminal = vscode.window.createTerminal("Jupyterlab");
		terminal.sendText("jupyter-lab");
		terminal.hide();
		}
		else{
			let existingSession = execSync("jupyter-lab list | grep 'http' | tail -n 1 | cut -d '?' -f1").toString().trim();
		 	vscode.window.showInformationMessage("Jupyterlab already running\n " + existingSession);	
		}
		
	}));

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);


	const openFileInBrowser = 'jupyterlab-browser.openFileInBrowser';
	subscriptions.push(vscode.commands.registerCommand(openFileInBrowser, () => {
		let terminal = vscode.window.createTerminal("tmp-terminal");
		const jupyter = isJupyterServerRunning();
		if (!jupyter){
		let terminal = vscode.window.createTerminal("Jupyterlab");
		terminal.sendText("jupyter-lab");
		terminal.hide();
		}
		else{
			let existingSession = execSync("jupyter-lab list | grep 'http' | tail -n 1 | cut -d '?' -f1").toString().trim();
			vscode.env.openExternal(vscode.Uri.parse(existingSession + 'lab/tree/test.py'));

		}
	// let command = "sc=`jupyter-lab list | grep 'http' | wc -l`; jl=$(jupyter-lab list | grep 'http' | tail -n 1 | cut -d '?' -f1); jl+='lab/tree/test.py'; if [[ $((sc)) -ge 1 ]]; then open '$jl'; sleep 3; exit; else nohup jupyter-lab --port 5081 & ; sleep 2; open http://localhost:5081/lab/tree/test.py; sleep 3; exit;fi";
	// terminal.sendText(command);
	console.log();

	

	}));

	updateStatusBarItem();

}

function isJupyterServerRunning() {
	let data = execSync("jupyter-lab list | grep 'http' | wc -l").toString().trim();
	let jupyterServerRunning: Boolean = true;

	if (data === "0") {
		jupyterServerRunning = false;
	}
	return jupyterServerRunning;
} 



function updateStatusBarItem(): void {

		myStatusBarItem.text = `$(notebook) Jupyter`;
		myStatusBarItem.tooltip = `Start Jupyterlab in Browser`;
		myStatusBarItem.show();
	}
